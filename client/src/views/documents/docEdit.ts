import { DocumentDto } from "@db/api"
import { css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import * as docService from "@db/client/views/documents/docsService.js"
import { AuthUserElement } from "@db/client/components/AuthUserElement.js"


@customElement("doc-edit")
export class UsersList extends AuthUserElement {

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
      this.error = err
    }
  }

  contentEdit?: string | null

  onContentChange(e: CustomEvent<{ html: string }>) {
    this.contentEdit = e.detail.html
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
          <button @click=${this.get}>Get doc</button>
          <error-viewer .error=${this.error}></error-viewer>
        </div>
      `
    }

    return html`
      <section>
        ${this.doc.title}
      </section>
      <label>Edit</label>
      <rich-text
        .content=${this.contentEdit ?? ""}
        @content-change=${this.onContentChange}
      ></rich-text>
      <wa-button variant="neutral" appearance="filled" @click=${this.saveDoc}>
        <wa-icon name="floppy-disk" variant="regular"></wa-icon>
      </wa-button>
    `
  }
}