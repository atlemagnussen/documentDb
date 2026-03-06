import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { Toast } from "./index.js"
import { classMap } from "lit/directives/class-map.js"
import { styleMap } from "lit/directives/style-map.js"

type AnimationState = "nothing" | "slide-in" | "slide-out"

@customElement('toast-component')
export class ToastComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      --toast-animation-time: 1s; /* will be overridden from js variable */
      --toast-opacity: 0.9;
    }
    .toast {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1.2rem;
      font-weight: 600;
      gap: 1rem;
      box-sizing: border-box;
      padding: 1.6rem;
      color: var(--digilean-text-on-dark);
      max-width: 300px;
      overflow: hidden;
      border-radius: 5px;
      opacity: var(--toast-opacity);
      cursor: pointer;
      --toast-transform-slide-width: calc(100% + var(--toaster-margin));
      &.slide-in, &.slide-out {
        transform: translateX(var(--toast-transform-slide-width));
      }
      &:hover {
        box-shadow: 0 1px 3px var(--digilean-grey-pigeon), 0 2px 4px var(--digilean-grey-pigeon);
      }
    }
    fa-icon {
      color: var(--digilean-text-on-dark);
      font-size: 1.8rem;
    }
    .icon-container {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 2rem;
      height: 2rem;
      --digilean-icon-height: 2rem;
      --digilean-icon-width: 2rem;
    }
    digilean-checked {
      --digilean-icon-height: 2.2rem;
      --digilean-icon-width: 2.2rem;
    }
    .content {
      flex: auto;
      opacity: 1;
    }
    .info {
      background-color: var(--wa-color-brand-fill-quiet);
    }
    .success {
      background-color: var(--wa-color-success-fill-quiet);
    }
    .error {
      background-color: var(--wa-color-danger-fill-quiet);
    }
    .warning {
      background-color: var(--wa-color-danger-fill-quiet);
    }
    .default {
      background-color: var(--wa-color-neutral-fill-quiet);
    }
    .slide-in {
      animation: slide-in var(--toast-animation-time) forwards;
    }
    .slide-out {
      animation: slide-out var(--toast-animation-time) forwards;
    }   
    @keyframes slide-in {
      0% { 
        transform: translateX(var(--toast-transform-slide-width));
        opacity: 0;
      }
      100% { 
        transform: translateX(0%);
        opacity: var(--toast-opacity);
      }
    }
    @keyframes slide-out {
      0% { 
        transform: translateX(0%);
        opacity: var(--toast-opacity);
      }
      100% { 
        transform: translateX(var(--toast-transform-slide-width));
        opacity: 0;
      }
    }
  `

  @property({ attribute: true, type: Number })
  animationseconds = 2

  @property({ attribute: true, type: Number })
  index = 0

  _toast = new Toast("info", "")
  @property({ attribute: false })
  set toast(t: Toast) {
    this._toast = t
    t.changedCallback = () => this.toastUpdated()
    t.destroyCallback = () => this.destroyToast()
  }
  get toast() {
    return this._toast
  }

  toastUpdated() {
    this.requestUpdate()
  }
  @property({ attribute: true })
  animation: AnimationState = "nothing"

  connectedCallback(): void {
    super.connectedCallback()
    this.animation = "slide-in"
  }
  disconnectedCallback(): void {
    this.animation = "nothing"
    super.disconnectedCallback()
  }
  destroyToast() {
    this.animation = "slide-out"
    const evt = new CustomEvent("toast-removing", { composed: true, bubbles: false, detail: this.id })
    this.dispatchEvent(evt)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("animation done")
      }, this.animationseconds * 1000)
    })

  }
  getClasses() {
    const classes: Record<string, boolean> = { toast: true }
    classes[this.toast.type] = true
    classes[this.toast.size] = true
    classes[this.animation] = true
    return classes
  }
  getIcon() {
    if (this.toast.customIcon)
      return this.toast.customIcon

    switch (this.toast.type) {
      case "error":
        return `<wa-icon name="circle-exclamation"></wa-icon>`
      case "warning":
        return `<wa-icon name="exclamation"></wa-icon>`
      case "success":
        return `<wa-icon name="check"></wa-icon>`
      default:
        return `<wa-icon name="circle-info"></wa-icon>`
    }
  }
  render() {
    const classes = this.getClasses()
    const icon = this.getIcon()
    const styles = {
      "--toast-animation-time": `${this.animationseconds}s`
    }

    return html`
      <div class=${classMap(classes)} style=${styleMap(styles)}
        @click=${() => this.destroyToast()}>
        <div class="icon-container">
          ${unsafeHTML(icon)}
        </div>
        <div class="content">
          ${unsafeHTML(this.toast.content)}
        </div>
      </div>
    `
  }
}