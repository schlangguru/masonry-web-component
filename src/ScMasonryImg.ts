import { ScHTMLElement } from './ScHTMLElement';

export class ScMasonryImg extends ScHTMLElement {

  get src() {
    return this.getAttribute('src');
  }

  get thumbnail() {
    return this.getAttribute('thumbnail') || this.src;
  }

  get caption() {
    return this.getAttribute('caption');
  }

}

customElements.define('sc-masonry-img', ScMasonryImg);