import { html, LitElement, PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

const synth = window.speechSynthesis;
let voices: Array<SpeechSynthesisVoice> = [];

synth.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  console.log("Voices loaded:", voices.length);
}

@customElement("speech-test")
export class SpeechTest extends LitElement {

  @query("form")
  formEl?: HTMLFormElement

  @query("select")
  selectEl?: HTMLSelectElement

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.populateVoices()
  }

  populateVoices() {
    for (const voice of voices) {
      const option = document.createElement("option");
      option.textContent = `${voice.name} (${voice.lang})`;

      if (voice.default) {
        option.textContent += " — DEFAULT";
      }

      option.setAttribute("data-lang", voice.lang);
      option.setAttribute("data-name", voice.name);
      this.selectEl?.appendChild(option);
    }
  }

  onsubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const inputEl = this.formEl?.querySelector("input")
    const utterThis = new SpeechSynthesisUtterance(inputEl!.value)
    const selectedOption = this.selectEl?.selectedOptions[0].getAttribute("data-name")
    const selectedVoice = voices.find((v) => v.name === selectedOption)
    if (!selectedVoice)
      return
    
    utterThis.voice = selectedVoice

    synth.speak(utterThis)
    inputEl?.blur()
  }

  render() {
    return html`
      <form @submit=${this.onsubmit}>
        <input type="text" value="hello world" />
        <select></select>
        <button type="submit">Submit</button>
      </form>
    `
  }
}

