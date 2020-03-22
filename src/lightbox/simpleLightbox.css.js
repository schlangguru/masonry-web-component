import { html } from 'lit-html';

export function lightboxCSS() {
  return html`
    <style>
      .slbOverlay, .slbWrapOuter, .slbWrap {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .slbOverlay {
        overflow: hidden;
        z-index: 2000;
        background-color: #000;
        opacity: 0.7;
        -webkit-animation: slbOverlay 0.5s;
        -moz-animation: slbOverlay 0.5s;
        animation: slbOverlay 0.5s;
      }

      .slbWrapOuter {
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 2010;
      }

      .slbWrap {
        position: absolute;
        text-align: center;
      }

      .slbWrap:before {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }

      .slbContentOuter {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin: 0px auto;
        padding: 0 1em;
        box-sizing: border-box;
        z-index: 2020;
        text-align: left;
        max-width: 100%;
      }

      .slbContentEl .slbContentOuter {
        padding: 5em 1em;
      }

      .slbContent {
        position: relative;
      }

      .slbContentEl .slbContent {
        -webkit-animation: slbEnter 0.3s;
        -moz-animation: slbEnter 0.3s;
        animation: slbEnter 0.3s;
        background-color: #fff;
        box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.4);
      }

      .slbImageWrap {
        -webkit-animation: slbEnter 0.3s;
        -moz-animation: slbEnter 0.3s;
        animation: slbEnter 0.3s;
        position: relative;
      }

      .slbImageWrap:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 5em;
        bottom: 5em;
        display: block;
        z-index: -1;
        box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.6);
        background-color: #FFF;
      }

      .slbDirectionNext .slbImageWrap {
        -webkit-animation: slbEnterNext 0.4s;
        -moz-animation: slbEnterNext 0.4s;
        animation: slbEnterNext 0.4s;
      }

      .slbDirectionPrev .slbImageWrap {
        -webkit-animation: slbEnterPrev 0.4s;
        -moz-animation: slbEnterPrev 0.4s;
        animation: slbEnterPrev 0.4s;
      }

      .slbImage {
        width: auto;
        max-width: 100%;
        height: auto;
        display: block;
        line-height: 0;
        box-sizing: border-box;
        padding: 5em 0;
        margin: 0 auto;
      }

      .slbCaption {
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        font-size: 1.4em;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0.71429em 0;
        color: #fff;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
      }

      .slbCloseBtn, .slbArrow {
        margin: 0;
        padding: 0;
        border: 0;
        cursor: pointer;
        background: none;
      }

      .slbCloseBtn::-moz-focus-inner, .slbArrow::-moz-focus-inner {
        padding: 0;
        border: 0;
      }

      .slbCloseBtn:hover, .slbArrow:hover {
        opacity: 0.5;
      }

      .slbCloseBtn:active, .slbArrow:active {
        opacity: 0.8;
      }

      .slbCloseBtn {
        -webkit-animation: slbEnter 0.3s;
        -moz-animation: slbEnter 0.3s;
        animation: slbEnter 0.3s;
        font-size: 3em;
        width: 1.66667em;
        height: 1.66667em;
        line-height: 1.66667em;
        position: absolute;
        right: -0.33333em;
        top: 0;
        color: #fff;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
      }

      .slbLoading .slbCloseBtn {
        display: none;
      }

      .slbLoadingText {
        font-size: 1.4em;
        color: #fff;
        color: rgba(255, 255, 255, 0.9);
      }

      .slbArrows {
        position: fixed;
        top: 50%;
        left: 0;
        right: 0;
      }

      .slbLoading .slbArrows {
        display: none;
      }

      .slbArrow {
        position: absolute;
        top: 50%;
        margin-top: -5em;
        width: 5em;
        height: 10em;
        opacity: 0.7;
        text-indent: -999em;
        overflow: hidden;
      }

      .slbArrow:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -0.8em 0 0 -0.8em;
        border: 0.8em solid transparent;
      }

      .slbArrow.next {
        right: 0;
      }

      .slbArrow.next:before {
        border-left-color: #fff;
      }

      .slbArrow.prev {
        left: 0;
      }

      .slbArrow.prev:before {
        border-right-color: #fff;
      }

      .slbIframeCont {
        width: 80em;
        height: 0;
        overflow: hidden;
        padding-top: 56.25%;
        margin: 5em 0;
      }

      .slbIframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.6);
        background: #000;
      }

      @-webkit-keyframes slbOverlay {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.7;
        }
      }

      @-moz-keyframes slbOverlay {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.7;
        }
      }

      @keyframes slbOverlay {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.7;
        }
      }

      @-webkit-keyframes slbEnter {
        from {
          opacity: 0;
          -webkit-transform: translate3d(0, -1em, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
        }
      }

      @-moz-keyframes slbEnter {
        from {
          opacity: 0;
          -moz-transform: translate3d(0, -1em, 0);
        }
        to {
          opacity: 1;
          -moz-transform: translate3d(0, 0, 0);
        }
      }

      @keyframes slbEnter {
        from {
          opacity: 0;
          -webkit-transform: translate3d(0, -1em, 0);
          -moz-transform: translate3d(0, -1em, 0);
          -ms-transform: translate3d(0, -1em, 0);
          -o-transform: translate3d(0, -1em, 0);
          transform: translate3d(0, -1em, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          -ms-transform: translate3d(0, 0, 0);
          -o-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
      }

      @-webkit-keyframes slbEnterNext {
        from {
          opacity: 0;
          -webkit-transform: translate3d(4em, 0, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
        }
      }

      @-moz-keyframes slbEnterNext {
        from {
          opacity: 0;
          -moz-transform: translate3d(4em, 0, 0);
        }
        to {
          opacity: 1;
          -moz-transform: translate3d(0, 0, 0);
        }
      }

      @keyframes slbEnterNext {
        from {
          opacity: 0;
          -webkit-transform: translate3d(4em, 0, 0);
          -moz-transform: translate3d(4em, 0, 0);
          -ms-transform: translate3d(4em, 0, 0);
          -o-transform: translate3d(4em, 0, 0);
          transform: translate3d(4em, 0, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          -ms-transform: translate3d(0, 0, 0);
          -o-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
      }

      @-webkit-keyframes slbEnterPrev {
        from {
          opacity: 0;
          -webkit-transform: translate3d(-4em, 0, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
        }
      }

      @-moz-keyframes slbEnterPrev {
        from {
          opacity: 0;
          -moz-transform: translate3d(-4em, 0, 0);
        }
        to {
          opacity: 1;
          -moz-transform: translate3d(0, 0, 0);
        }
      }

      @keyframes slbEnterPrev {
        from {
          opacity: 0;
          -webkit-transform: translate3d(-4em, 0, 0);
          -moz-transform: translate3d(-4em, 0, 0);
          -ms-transform: translate3d(-4em, 0, 0);
          -o-transform: translate3d(-4em, 0, 0);
          transform: translate3d(-4em, 0, 0);
        }
        to {
          opacity: 1;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          -ms-transform: translate3d(0, 0, 0);
          -o-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
      }
    </style>  
  `;
}