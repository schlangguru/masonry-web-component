import { ScHTMLElement } from './ScHTMLElement';

export class ScMasonryImg extends ScHTMLElement {

  get src() {
    return this.getAttribute('src');
  }

}

customElements.define('sc-masonry-img', ScMasonryImg);