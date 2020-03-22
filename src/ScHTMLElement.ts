import { TemplateResult, html, render } from 'lit-html'

export abstract class ScHTMLElement extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.render();
  }

  render() {
    render(this.template(), this.shadowRoot);
  }

  template(): TemplateResult {
    return html``;
  };

}