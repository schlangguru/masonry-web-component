import { ScHTMLElement } from './ScHTMLElement'
import { html } from 'lit-html';
import './ScMasonryImg.js';

import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { ScMasonryImg } from './ScMasonryImg.js';

export class ScMasonry extends ScHTMLElement {

  constructor() {
    super();
  }

  template() {
    return html`
      <style>
        #grid-sizer, .grid-item {
          width: ${ this.columnWidthCss };
        }

        .grid-item {
          margin-bottom: ${ this.gutter }px;
          height: auto;
        }
      </style>
      <div id="grid">
        <div id="grid-sizer"></div>
        ${ this.imagesTemplate()}
      </div>
    `;
  }

  imagesTemplate() {
    return this.images.map(element =>
      html`<img class="grid-item" src=${element.src}>`
    );
  }

  render() {
    super.render();
    this.initMasonry();
  }

  initMasonry() {
    const grid = this.shadowRoot.getElementById('grid');
    imagesLoaded(grid, () => {
      new Masonry(grid, {
        itemSelector: 'img',
        columnWidth: '#grid-sizer',
        percentPosition: false,
        gutter: this.gutter
      });
    });
  }

  get images(): ScMasonryImg[] {
    const nodeList = this.querySelectorAll('sc-masonry-img');
    return [...nodeList] as ScMasonryImg[];
  }

  get columns() {
    return Number(this.getAttribute('columns')|| 3);
  }

  get gutter() {
    return Number(this.getAttribute('gutter') || 0);
  }

  get isColumnWidthFixed() {
    return this.hasAttribute('fixed-column-width');
  }

  get columnWidthCss() {
    if (this.isColumnWidthFixed) {
      return `${ this.getAttribute('column-width') || 250 }px`;
    } else {
      return `calc(${ 100 / this.columns }% - ${ this.gutter - (this.gutter / this.columns) }px)`;
    }
  }

}

customElements.define('sc-masonry', ScMasonry);