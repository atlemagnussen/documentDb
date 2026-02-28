import { DocumentDto } from "@db/api"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import * as docService from "@db/client/views/documents/docsService.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"


@customElement("doc-edit")
export class UsersList extends LitElement {

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `
  connectedCallback(): void {
    super.connectedCallback()
    this.get()
  }

  @property({ attribute: true })
  docid?: string

  @state()
  doc?: DocumentDto

  get = async () => {
    if (!this.docid)
      return
    try {
      const doc = await docService.get(this.docid)
      this.doc = doc
      this.contentEdit = doc.content
    } catch (err: any) {
      console.error(err)
    }
  }

  contentEdit?: string | null
  contentUpdate(e: InputEvent) {
    if (e.target) {
      const newContent = (e.target as HTMLDivElement).innerHTML
      this.contentEdit = newContent
    }
  }
  saveDoc() {
    if (!this.docid || !this.doc)
      return
    const doc:DocumentDto = {
      id: this.docid,
      title: this.doc?.title,
      content: this.contentEdit
    }
    docService.update(this.docid, doc)
  }
  render() {
    if (!this.doc) {
      return html`
        <div>
          <p>No result</p>
          <button @click=${this.get}>Get Dbs</button>
        </div>
        `
    }

    return html`
      <section>
        ${this.doc.title}
      </section>
      <section>
        <div contenteditable @input=${(e: InputEvent) => this.contentUpdate(e)}>
${unsafeHTML(this.contentEdit)}
        </div>
      </section>
      <wa-button variant="neutral" appearance="filled" @click=${this.saveDoc}>
        <wa-icon name="floppy-disk" variant="regular"></wa-icon>
      </wa-button>
    `
  }
}