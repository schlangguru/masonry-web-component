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

      ${ this.isLightboxEnabled ? simpleLightBoxStyle : '' }

      <div id="grid">
        <div id="grid-sizer"></div>
        ${ this.imagesTemplate()}
      </div>

      <div id="lightbox"></div>
    `;
  }

  imagesTemplate() {
    return this.images.map(element => {
      if (this.isLightboxEnabled) {
        return html`
          <a href="${ element.src }" title="${ element.caption || '' }">
            <img class="grid-item" src=${ element.thumbnail } alt="${ element.caption || '' }">
          </a>
        `
      } else {
        return html`<img class="grid-item" src=${ element.src } alt="${ element.caption || '' }">`;
      }
    });
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

      if (this.isLightboxEnabled) {
        new SimpleLightbox({
          elements: this.shadowRoot.querySelectorAll('#grid a'),
          appendTarget: this.shadowRoot.getElementById('lightbox')
        });
      }
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
    return this.hasAttribute('column-width');
  }

  get columnWidthCss() {
    if (this.isColumnWidthFixed) {
      return `${ this.getAttribute('column-width') || 250 }px`;
    } else {
      return `calc(${ 100 / this.columns }% - ${ this.gutter - (this.gutter / this.columns) }px)`;
    }
  }

  get isLightboxEnabled() {
    return this.hasAttribute('lightbox');
  }

}

customElements.define('sc-masonry', ScMasonry);