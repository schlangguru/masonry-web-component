import { ScHTMLElement } from './ScHTMLElement'
import { html } from 'lit-html';
import './ScMasonryImg';

import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { SimpleLightbox, simpleLightBoxStyle } from './lightbox/SimpleLightbox.js'
import { ScMasonryImg } from './ScMasonryImg';

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

      ${ simpleLightBoxStyle }

      <div id="grid">
        <div id="grid-sizer"></div>
        ${ this.imagesTemplate()}
      </div>

      <div id="lightbox"></div>
    `;
  }

  imagesTemplate() {
    return this.images.map(element =>
      html`
        <a href="${ element.src }" title="Caption for gallery item 1">
          <img class="grid-item" src=${ element.src }>
        </a>
      `
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

      new SimpleLightbox({
        elements: this.shadowRoot.querySelectorAll('#grid a'),
        appendTarget: this.shadowRoot.getElementById('lightbox')
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