import { DocumentDto } from "@db/api"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import * as docService from "@db/client/views/documents/docsService.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"


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
  slug?: string

  @state()
  doc?: DocumentDto

  @state()
  error?: Error

  get = async () => {
    if (!this.slug)
      return
    try {
      const doc = await docService.get(this.slug)
      this.doc = doc
    } catch (err: any) {
      this.error = err
    }
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
      <section>
        ${unsafeHTML(this.doc.content)}
      </section>
      
    `
  }
}