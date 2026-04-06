import { css, html, LitElement, nothing, PropertyValues } from "lit"
import { customElement, query, state } from "lit/decorators.js"

@customElement("speech-test")
export class SpeechButton extends LitElement {
  
  static styles = css`
    :host {
      display: block;
    }
  `

  connectedCallback() {
    super.connectedCallback();
    window.speechSynthesis.addEventListener("voiceschanged", this.populateVoices)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.speechSynthesis.removeEventListener("voiceschanged", this.populateVoices)
  }

  @query("select")
  selectEl?: HTMLSelectElement

  @state()
  voices: Array<SpeechSynthesisVoice> = [];

  @state()
  isSpeaking = false

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.populateVoices()
  }

  populateVoices = () => {
    this.voices = window.speechSynthesis.getVoices()
  }

  startSpeaking = () => {

    this.isSpeaking = true

    const inputEl = this.renderRoot.querySelector("input")
    const utterance = new SpeechSynthesisUtterance(inputEl!.value)
    const selectedOption = this.selectEl!.selectedOptions[0]
    const selectedVoice = this.voices.find((v) => v.name === selectedOption.value)
    if (!selectedVoice)
      return
    
    utterance.voice = selectedVoice

    window.speechSynthesis.speak(utterance)
  }
  togglePauseSpeaking = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
    else if (window.speechSynthesis.speaking)
      window.speechSynthesis.pause()
  }
  stopSpeaking = () => {
    if (window.speechSynthesis.speaking)
      window.speechSynthesis.cancel()
    this.isSpeaking = false
  }

  render() {
    return html`
      <input type="text" value="hello world" />
      <select>
        ${this.renderVoices()}
      </select>
      ${this.isSpeaking ? html`
        <button id="pausespeaking" @click=${this.togglePauseSpeaking}>Pause</button>
        <button id="stopspeaking" @click=${this.stopSpeaking}>Stop</button>
      ` : html`
        <button id="startspeaking" @click=${this.startSpeaking}>Start</button>
      `}
    `
  }
  renderVoices() {
    return this.voices.map(v => {
      return html `
        <option value=${v.name}>
          ${v.name} (${v.lang}) ${v.default ? "default" : nothing}
        </option>
      `
    })
  }
}

