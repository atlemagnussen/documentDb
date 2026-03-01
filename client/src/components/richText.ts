import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser as PMDOMParser, DOMSerializer } from "prosemirror-model"
import { schema as basicSchema } from "prosemirror-schema-basic"
import { addListNodes, liftListItem, sinkListItem, wrapInList } from "prosemirror-schema-list"
import { history, redo, undo } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap, setBlockType, toggleMark } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"

type Command = (state: EditorState, dispatch?: EditorView["dispatch"], view?: EditorView) => boolean

const editorSchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks
})

function parseHtmlToDoc(html: string) {
  const container = document.createElement("div")
  container.innerHTML = html || "<p></p>"
  const parser = PMDOMParser.fromSchema(editorSchema)
  return parser.parse(container)
}

function serializeDocToHtml(state: EditorState) {
  const serializer = DOMSerializer.fromSchema(editorSchema)
  const fragment = serializer.serializeFragment(state.doc.content)
  const container = document.createElement("div")
  container.appendChild(fragment)
  return container.innerHTML
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

    .ProseMirror {
      outline: none;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 10rem;
    }

    .ProseMirror p {
      margin: 0 0 0.75rem;
    }

    .toolbar wa-button::part(base) {
      padding-inline: 0.5rem;
    }
  `

  @property({ attribute: false })
  content = ""

  private editorView?: EditorView
  private applyingExternalContent = false

  private menuItems = [
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
          "Shift-Tab": liftListItem(editorSchema.nodes.list_item),
          "Tab": sinkListItem(editorSchema.nodes.list_item)
        }),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor()
      ]
    })
  }

  private emitContentChange() {
    if (!this.editorView) return
    if (this.applyingExternalContent) return

    const html = serializeDocToHtml(this.editorView.state)
    this.dispatchEvent(
      new CustomEvent("content-change", {
        detail: { html },
        bubbles: true,
        composed: true
      })
    )
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

    this.requestUpdate()
  }

  updated(changed: Map<string, unknown>) {
    if (!changed.has("content")) return
    if (!this.editorView) return

    const currentHtml = serializeDocToHtml(this.editorView.state)
    if (currentHtml === this.content) return

    this.applyingExternalContent = true
    const nextState = this.buildState(this.content)
    this.editorView.updateState(nextState)
    this.applyingExternalContent = false
  }

  disconnectedCallback() {
    this.editorView?.destroy()
    this.editorView = undefined
    super.disconnectedCallback()
  }

  render() {
    return html`
      <div class="toolbar">
        ${this.menuItems.map(item => {
          const command = item.command()
          return html`
            <wa-button
              size="small"
              variant="neutral"
              appearance="filled"
              ?disabled=${!this.commandEnabled(command)}
              @click=${() => this.runCommand(command)}
            >
              <wa-icon name=${item.icon} variant="solid"></wa-icon>
            </wa-button>
          `
        })}
      </div>
      <div id="editor" class="editor-host"></div>
    `
  }
}