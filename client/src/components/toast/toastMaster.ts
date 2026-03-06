import { LitElement, html, css } from "lit"
import { customElement, state } from "lit/decorators.js"
import { Toast } from "./index.js"
import "./toastComponent"
import { ToastComponent } from "./toastComponent.js"
import toastService, { toastsState } from "./index.js"
import { effect } from "@db/client/services/effect.js"

@customElement('toast-master')
export class ToastMaster extends LitElement {
  static styles = css`
    :host {
      --toaster-margin: 0.5rem;
      background-color: transparent;
      display: flex;
      flex-direction: column;
      justify-content: start;
      gap: var(--toaster-margin);
      width: 300px;
      inset: unset;
      margin: 0;
      top: var(--toaster-margin);
      right: var(--toaster-margin);
      border: 0;
    }
    .toast-container {
      flex: auto;
    }
  `

  private animationSeconds = 0.3

  @state()
  toasts: Toast[] = []

  connectedCallback(): void {
    super.connectedCallback()

    effect(() => {
      this.toasts = toastsState.get()
    })
  }
  onToastRemoving(e: CustomEvent) {
    const toastId = (e.target as HTMLElement).id // e.detail as string
    this.removeToastDelay(toastId)
  }
  removeToastDelay(id: string) {
    if (!id)
      return
    setTimeout(() => {
      let toastEl = this.renderRoot.querySelector(`#${id}`) as ToastComponent | null
      if (toastEl)
        toastEl.animation = "nothing"
      toastEl = null

      toastService.removeToast(id)
    }, this.animationSeconds * 1000)
  }

  render() {
    return html`
      ${this.toasts.map(t =>
      html`
        <toast-component id="${t.id}"
          animationseconds="${this.animationSeconds}"
          @toast-removing=${this.onToastRemoving}
          .toast=${t}>
        </toast-component>
      `
      )}
    `
  }
}