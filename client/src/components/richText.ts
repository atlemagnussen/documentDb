import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser as PMDOMParser, DOMSerializer } from "prosemirror-model"
import { schema as basicSchema } from "prosemirror-schema-basic"
import { addListNodes, liftListItem, sinkListItem, wrapInList } from "prosemirror-schema-list"
import { history, redo, undo } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap, chainCommands, setBlockType, toggleMark } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"
import { addColumnAfter, addRowAfter, deleteColumn, deleteRow, deleteTable, goToNextCell, isInTable, tableEditing, tableNodes } from "prosemirror-tables"

type Command = (state: EditorState, dispatch?: EditorView["dispatch"], view?: EditorView) => boolean
type MenuItem = {
  label: string
  icon: string
  command?: () => Command
  onClick?: () => void
  isDisabled?: () => boolean
}

const editorSchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block").append(
    tableNodes({
      tableGroup: "block",
      cellContent: "block+",
      cellAttributes: {}
    })
  ),
  marks: basicSchema.spec.marks
})

type EditorMode = "rich" | "markdown" | "html"
type ContentChangeDetail = {
  html: string
  markdown: string
}

function parseHtmlToDoc(html: string) {
  const container = document.createElement("div")
  container.innerHTML = html || "<p></p>"
  const parser = PMDOMParser.fromSchema(editorSchema)
  return parser.parse(container)
}

function parseMarkdownToDoc(markdown: string) {
  return defaultMarkdownParser.parse(markdown || "")
}

function serializeDocToHtml(state: EditorState) {
  const serializer = DOMSerializer.fromSchema(editorSchema)
  const fragment = serializer.serializeFragment(state.doc.content)
  const container = document.createElement("div")
  container.appendChild(fragment)

  // Ensure all serialized links open in a new tab with safe opener behavior.
  container.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(anchor => {
    anchor.setAttribute("target", "_blank")
    anchor.setAttribute("rel", "noopener noreferrer")
  })

  return container.innerHTML
}

function serializeDocToMarkdown(state: EditorState) {
  // The default serializer does not support table nodes, so fallback to empty markdown.
  try {
    return defaultMarkdownSerializer.serialize(state.doc)
  } catch {
    return ""
  }
}

@customElement("rich-text")
export class RichTextEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      --editor-border: var(--wa-color-border-normal, #d6d6d6);
      --editor-bg: var(--wa-color-surface-raised, #1c1c1c);
      --editor-fg: var(--wa-color-text-normal, #f5f5f5);
    }

    .mode-switch {
      display: flex;
      gap: var(--wa-space-2xs, 0.25rem);
      margin-bottom: var(--wa-space-2xs, 0.25rem);
    }

    .mode-switch wa-button {
      flex: 0 0 auto;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wa-space-2xs, 0.25rem);
      padding: var(--wa-space-2xs, 0.25rem);
      border: 1px solid var(--editor-border);
      border-bottom: 0;
      border-top-left-radius: var(--wa-border-radius-m, 0.5rem);
      border-top-right-radius: var(--wa-border-radius-m, 0.5rem);
      background: var(--editor-bg);
    }

    .editor-host {
      min-height: 12rem;
      border: 1px solid var(--editor-border);
      border-bottom-left-radius: var(--wa-border-radius-m, 0.5rem);
      border-bottom-right-radius: var(--wa-border-radius-m, 0.5rem);
      background: var(--editor-bg);
      color: var(--editor-fg);
      padding: 0.75rem;
    }

    .editor-host[hidden] {
      display: none;
    }

    .source-editor {
      border: 1px solid var(--editor-border);
      border-bottom-left-radius: var(--wa-border-radius-m, 0.5rem);
      border-bottom-right-radius: var(--wa-border-radius-m, 0.5rem);
      background: var(--editor-bg);
      color: var(--editor-fg);
      padding: 0.75rem;
    }

    .source-editor[hidden] {
      display: none;
    }

    .source-editor wa-textarea {
      width: 100%;
    }

    .source-editor wa-textarea::part(textarea) {
      min-height: 12rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .ProseMirror {
      outline: none;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 10rem;
    }

    .ProseMirror p {
      margin: 0 0 0.75rem;
    }

    .ProseMirror table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 0 0 0.75rem;
    }

    .ProseMirror th,
    .ProseMirror td {
      border: 1px solid var(--editor-border);
      padding: 0.4rem;
      vertical-align: top;
    }

    .ProseMirror .selectedCell {
      background-color: rgba(120, 180, 255, 0.15);
    }

    .toolbar wa-button::part(base) {
      padding-inline: 0.5rem;
    }
  `

  @property({ attribute: false })
  content = ""

  @property({ type: Boolean, attribute: "allow-markdown" })
  allowMarkdown = false

  @property({ type: Boolean, attribute: "allow-html-source" })
  allowHtmlSource = false

  private editorView?: EditorView
  private applyingExternalContent = false

  @state()
  private editorMode: EditorMode = "rich"

  @state()
  private markdownContent = ""

  @state()
  private htmlSourceContent = ""

  private menuItems: MenuItem[] = [
    {
      label: "Bold",
      icon: "bold",
      command: () => toggleMark(editorSchema.marks.strong)
    },
    {
      label: "Italic",
      icon: "italic",
      command: () => toggleMark(editorSchema.marks.em)
    },
    {
      label: "Insert link",
      icon: "link",
      onClick: () => this.insertLink(),
      isDisabled: () => {
        const linkMark = editorSchema.marks.link
        if (!linkMark) return true
        return !this.commandEnabled(toggleMark(linkMark, { href: "https://" }))
      }
    },
    {
      label: "Paragraph",
      icon: "paragraph",
      command: () => setBlockType(editorSchema.nodes.paragraph)
    },
    {
      label: "Heading",
      icon: "heading",
      command: () => setBlockType(editorSchema.nodes.heading, { level: 2 })
    },
    {
      label: "Bullet list",
      icon: "list-ul",
      command: () => wrapInList(editorSchema.nodes.bullet_list)
    },
    {
      label: "Numbered list",
      icon: "list-ol",
      command: () => wrapInList(editorSchema.nodes.ordered_list)
    },
    {
      label: "Insert table",
      icon: "table",
      command: () => this.insertTableCommand(2, 2)
    },
    {
      label: "Add row",
      icon: "plus",
      command: () => addRowAfter
    },
    {
      label: "Add column",
      icon: "plus",
      command: () => addColumnAfter
    },
    {
      label: "Delete row",
      icon: "minus",
      command: () => deleteRow
    },
    {
      label: "Delete column",
      icon: "minus",
      command: () => deleteColumn
    },
    {
      label: "Delete table",
      icon: "trash",
      command: () => deleteTable
    },
    {
      label: "Outdent",
      icon: "outdent",
      command: () => liftListItem(editorSchema.nodes.list_item)
    },
    {
      label: "Indent",
      icon: "indent",
      command: () => sinkListItem(editorSchema.nodes.list_item)
    },
    {
      label: "Undo",
      icon: "rotate-left",
      command: () => undo
    },
    {
      label: "Redo",
      icon: "rotate-right",
      command: () => redo
    }
  ]

  private buildState(content: string) {
    return EditorState.create({
      schema: editorSchema,
      doc: parseHtmlToDoc(content),
      plugins: [
        history(),
        keymap({
          "Mod-b": toggleMark(editorSchema.marks.strong),
          "Mod-i": toggleMark(editorSchema.marks.em),
          "Shift-Tab": chainCommands(goToNextCell(-1), liftListItem(editorSchema.nodes.list_item)),
          "Tab": chainCommands(this.goToNextCellOrAddRow(), sinkListItem(editorSchema.nodes.list_item))
        }),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        tableEditing()
      ]
    })
  }

  private buildStateFromMarkdown(markdown: string) {
    return EditorState.create({
      schema: editorSchema,
      doc: parseMarkdownToDoc(markdown),
      plugins: [
        history(),
        keymap({
          "Mod-b": toggleMark(editorSchema.marks.strong),
          "Mod-i": toggleMark(editorSchema.marks.em),
          "Shift-Tab": chainCommands(goToNextCell(-1), liftListItem(editorSchema.nodes.list_item)),
          "Tab": chainCommands(this.goToNextCellOrAddRow(), sinkListItem(editorSchema.nodes.list_item))
        }),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        tableEditing()
      ]
    })
  }

  private insertTableCommand(rows: number, cols: number): Command {
    return (state, dispatch) => {
      const tableType = editorSchema.nodes.table
      const rowType = editorSchema.nodes.table_row
      const cellType = editorSchema.nodes.table_cell
      if (!tableType || !rowType || !cellType) return false

      const rowNodes = []
      for (let row = 0; row < rows; row++) {
        const cells = []
        for (let col = 0; col < cols; col++) {
          const cell = cellType.createAndFill()
          if (!cell) return false
          cells.push(cell)
        }

        const rowNode = rowType.createAndFill(undefined, cells)
        if (!rowNode) return false
        rowNodes.push(rowNode)
      }

      const table = tableType.createAndFill(undefined, rowNodes)
      if (!table) return false

      if (dispatch) {
        dispatch(state.tr.replaceSelectionWith(table).scrollIntoView())
      }

      return true
    }
  }

  private goToNextCellOrAddRow(): Command {
    return (state, dispatch, view) => {
      const moved = goToNextCell(1)(state, dispatch, view)
      if (moved) return true
      if (!isInTable(state)) return false

      const added = addRowAfter(state, dispatch)
      if (!added) return false

      if (!dispatch || !view) return true

      return goToNextCell(1)(view.state, dispatch, view)
    }
  }

  private updateContentFromState(state: EditorState) {
    this.htmlSourceContent = serializeDocToHtml(state)
    this.markdownContent = serializeDocToMarkdown(state)
  }

  private updateContentFromHtml(html: string) {
    this.htmlSourceContent = html
    this.markdownContent = serializeDocToMarkdown(this.buildState(html))
  }

  private dispatchContentChange(detail: ContentChangeDetail) {
    this.dispatchEvent(
      new CustomEvent("content-change", {
        detail,
        bubbles: true,
        composed: true
      })
    )
  }

  private emitContentChange() {
    if (!this.editorView) return
    if (this.applyingExternalContent) return

    this.updateContentFromState(this.editorView.state)
    this.dispatchContentChange({
      html: this.htmlSourceContent,
      markdown: this.markdownContent
    })
  }

  private runCommand(command: Command) {
    const view = this.editorView
    if (!view) return
    const didRun = command(view.state, view.dispatch, view)
    if (didRun) view.focus()
  }

  private commandEnabled(command: Command) {
    const view = this.editorView
    if (!view) return false
    return command(view.state)
  }

  private insertLink() {
    const view = this.editorView
    if (!view) return

    const linkMark = editorSchema.marks.link
    if (!linkMark) return

    const selectedLink = linkMark.isInSet(view.state.selection.$from.marks())
    const defaultHref = selectedLink?.attrs.href ?? "https://"
    const hrefInput = window.prompt("Enter URL", defaultHref)
    if (hrefInput === null) return

    const href = hrefInput.trim()
    if (!href) {
      this.runCommand(toggleMark(linkMark))
      return
    }

    this.runCommand(toggleMark(linkMark, { href, title: href }))
  }

  private setEditorMode(mode: EditorMode) {
    const modeEnabled = mode === "rich" || (mode === "markdown" && this.allowMarkdown) || (mode === "html" && this.allowHtmlSource)
    if (!modeEnabled) return
    if (this.editorMode === mode) return

    if (this.editorMode === "html" && this.editorView) {
      this.applyingExternalContent = true
      this.editorView.updateState(this.buildState(this.htmlSourceContent))
      this.applyingExternalContent = false
    }

    if (this.editorView && mode === "markdown") {
      this.updateContentFromState(this.editorView.state)
    }

    this.editorMode = mode
  }

  private onMarkdownInput(event: Event) {
    const target = event.target as { value?: string }
    const markdown = target.value ?? ""
    this.markdownContent = markdown

    if (!this.editorView) return

    this.applyingExternalContent = true
    this.editorView.updateState(this.buildStateFromMarkdown(markdown))
    this.updateContentFromState(this.editorView.state)
    this.applyingExternalContent = false
    this.dispatchContentChange({
      html: this.htmlSourceContent,
      markdown: this.markdownContent
    })
  }

  private onHtmlInput(event: Event) {
    const target = event.target as { value?: string }
    const html = target.value ?? ""
    this.updateContentFromHtml(html)

    this.dispatchContentChange({
      html: this.htmlSourceContent,
      markdown: this.markdownContent
    })
  }

  firstUpdated() {
    const editorHost = this.renderRoot.querySelector<HTMLDivElement>("#editor")
    if (!editorHost) return

    this.editorView = new EditorView(editorHost, {
      state: this.buildState(this.content),
      dispatchTransaction: transaction => {
        if (!this.editorView) return
        const nextState = this.editorView.state.apply(transaction)
        this.editorView.updateState(nextState)

        if (transaction.docChanged) {
          this.emitContentChange()
          this.requestUpdate()
        }
      }
    })

    this.updateContentFromHtml(this.content)

    this.requestUpdate()
  }

  updated(changed: Map<string, unknown>) {
    if (!changed.has("content")) return
    if (!this.editorView) return

    const currentHtml = this.editorMode === "html" ? this.htmlSourceContent : serializeDocToHtml(this.editorView.state)
    if (currentHtml === this.content) return

    this.applyingExternalContent = true
    const nextState = this.buildState(this.content)
    this.editorView.updateState(nextState)
    this.updateContentFromHtml(this.content)
    this.applyingExternalContent = false
  }

  disconnectedCallback() {
    this.editorView?.destroy()
    this.editorView = undefined
    super.disconnectedCallback()
  }

  render() {
    const showModeSwitch = this.allowMarkdown || this.allowHtmlSource

    return html`
      ${showModeSwitch ? html`
        <div class="mode-switch">
          <wa-button
            size="small"
            variant="neutral"
            appearance=${this.editorMode === "rich" ? "filled" : "outlined"}
            @click=${() => this.setEditorMode("rich")}
          >
            Visual
          </wa-button>
          ${this.allowMarkdown ? html`
            <wa-button
              size="small"
              variant="neutral"
              appearance=${this.editorMode === "markdown" ? "filled" : "outlined"}
              @click=${() => this.setEditorMode("markdown")}
            >
              Markdown
            </wa-button>
          ` : null}
          ${this.allowHtmlSource ? html`
            <wa-button
              size="small"
              variant="neutral"
              appearance=${this.editorMode === "html" ? "filled" : "outlined"}
              @click=${() => this.setEditorMode("html")}
            >
              HTML
            </wa-button>
          ` : null}
        </div>
      ` : null}
      ${this.editorMode === "rich" ? html`
        <div class="toolbar">
          ${this.menuItems.map(item => {
            const command = item.command?.()
            const disabled = item.isDisabled ? item.isDisabled() : command ? !this.commandEnabled(command) : false
            return html`
              <wa-button
                size="small"
                variant="neutral"
                appearance="filled"
                title=${item.label}
                aria-label=${item.label}
                ?disabled=${disabled}
                @click=${() => {
                  if (item.onClick) {
                    item.onClick()
                    return
                  }

                  if (command) this.runCommand(command)
                }}
              >
                <wa-icon name=${item.icon} variant="solid"></wa-icon>
              </wa-button>
            `
          })}
        </div>
      ` : null}
      <div id="editor" class="editor-host" ?hidden=${this.editorMode !== "rich"}></div>
      <div class="source-editor" ?hidden=${this.editorMode !== "markdown"}>
        <wa-textarea
          resize="vertical"
          .value=${this.markdownContent}
          @input=${this.onMarkdownInput}
        ></wa-textarea>
      </div>
      <div class="source-editor" ?hidden=${this.editorMode !== "html"}>
        <wa-textarea
          resize="vertical"
          .value=${this.htmlSourceContent}
          @input=${this.onHtmlInput}
        ></wa-textarea>
      </div>
    `
  }
}