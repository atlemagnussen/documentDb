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

    .doc-content {
      overflow-x: auto;
    }

    .doc-content table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 0.5rem 0 0.5rem;
    }

    .doc-content th,
    .doc-content td {
      border: 1px solid var(--wa-color-border-normal, #d6d6d6);
      padding: 0.4rem;
      vertical-align: top;
      text-align: left;
      word-break: break-word;
      p {
        margin-block-start: 0;
        margin-block-end: 0;
      }
    }

    .doc-content thead th {
      background: var(--wa-color-surface-lowered);
      font-weight: 600;
    }

    .doc-content tbody tr:nth-child(odd) td,
    .doc-content tbody tr:nth-child(odd) th {
      background: var(--wa-color-surface-default);
    }

    .doc-content tbody tr:nth-child(even) td,
    .doc-content tbody tr:nth-child(even) th {
      background: var(--wa-color-surface-lowered);
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
      <section class="doc-content">
        ${unsafeHTML(this.doc.content)}
      </section>
      
    `
  }
}