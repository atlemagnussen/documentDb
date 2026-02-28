import { DocumentDto } from "@db/api"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import * as docService from "@db/client/views/documents/docsService.js"


@customElement("doc-details")
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
    } catch (err: any) {
      console.error(err)
    }
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
        ${this.doc.content}
      </section>
      
    `
  }
}