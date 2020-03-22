import { html } from 'lit-html';

const DEFAULT_OPTIONS = {
    // add custom classes to lightbox elements
    elementClass: '',
    elementLoadingClass: 'slbLoading',
    htmlClass: 'slbActive',
    closeBtnClass: '',
    nextBtnClass: '',
    prevBtnClass: '',
    loadingTextClass: '',

    // customize / localize controls captions
    closeBtnCaption: 'Close',
    nextBtnCaption: 'Next',
    prevBtnCaption: 'Previous',
    loadingCaption: 'Loading...',

    bindToItems: true, // set click event handler to trigger lightbox on provided $items
    closeOnOverlayClick: true,
    closeOnEscapeKey: true,
    nextOnImageClick: true,
    showCaptions: true,

    captionAttribute: 'title', // choose data source for library to glean image caption from
    urlAttribute: 'href', // where to expect large image

    startAt: 0, // start gallery at custom index
    loadingTimeout: 100, // time after loading element will appear

    appendTarget: 'body', // append elsewhere if needed

    beforeSetContent: null, // convenient hooks for extending library behavoiur
    beforeClose: null,
    afterClose: null,
    beforeDestroy: null,
    afterDestroy: null,

    videoRegex: new RegExp(/youtube.com|vimeo.com/) // regex which tests load url for iframe content
};

// #########################
//           Class
// ########################
export class SimpleLightbox {

    constructor() {
        this.init.apply(this, arguments);
    }

    init(options) {
        options = this.options = assign({}, DEFAULT_OPTIONS, options);

        var self = this;
        var elements;

        if (options.$items) {
            elements = options.$items.get();
        }

        if (options.elements) {
            elements = [].slice.call(
                typeof options.elements === 'string'
                    ? document.querySelectorAll(options.elements)
                    : options.elements
            );
        }

        this.eventRegistry = {lightbox: [], thumbnails: []};
        this.items = [];
        this.captions = [];

        if (elements) {
            elements.forEach(function(element, index) {

                self.items.push(element.getAttribute(options.urlAttribute));
                self.captions.push(element.getAttribute(options.captionAttribute));

                if (options.bindToItems) {

                    self.addEvent(element, 'click', function(e) {

                        e.preventDefault();
                        self.showPosition(index);

                    }, 'thumbnails');

                }

            });

        }

        if (options.items) {
            this.items = options.items;
        }

        if (options.captions) {
            this.captions = options.captions;
        }
    }

    addEvent(element, eventName, callback, scope) {
        this.eventRegistry[scope || 'lightbox'].push({
            element: element,
            eventName: eventName,
            callback: callback
        });

        element.addEventListener(eventName, callback);

        return this;
    }

    removeEvents(scope) {
        this.eventRegistry[scope].forEach(function(item) {
            item.element.removeEventListener(item.eventName, item.callback);
        });

        this.eventRegistry[scope] = [];

        return this;
    }

    next() {
        return this.showPosition(this.currentPosition + 1);
    }

    prev() {
        return this.showPosition(this.currentPosition - 1);
    }

    normalizePosition(position) {
        if (position >= this.items.length) {
            position = 0;
        } else if (position < 0) {
            position = this.items.length - 1;
        }

        return position;
    }

    showPosition(position) {
        var newPosition = this.normalizePosition(position);

        if (typeof this.currentPosition !== 'undefined') {
            this.direction = newPosition > this.currentPosition ? 'next' : 'prev';
        }

        this.currentPosition = newPosition;

        return this.setupLightboxHtml()
            .prepareItem(this.currentPosition, this.setContent)
            .show();

    }

    loading(on) {
        var self = this;
        var options = this.options;

        if (on) {

            this.loadingTimeout = setTimeout(function() {

                addClass(self.$el, options.elementLoadingClass);

                self.$content.innerHTML =
                    '<p class="slbLoadingText ' + options.loadingTextClass + '">' +
                        options.loadingCaption +
                    '</p>';
                self.show();

            }, options.loadingTimeout);

        } else {

            removeClass(this.$el, options.elementLoadingClass);
            clearTimeout(this.loadingTimeout);

        }
    }

    prepareItem(position, callback) {
        var self = this;
        var url = this.items[position];

        this.loading(true);

        if (this.options.videoRegex.test(url)) {

            callback.call(self, parseHtml(
                '<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="' + url + '"></iframe></div>')
            );

        } else {

            var $imageCont = parseHtml(
                '<div class="slbImageWrap"><img class="slbImage" src="' + url + '" /></div>'
            );

            this.$currentImage = $imageCont.querySelector('.slbImage');

            if (this.options.showCaptions && this.captions[position]) {
                $imageCont.appendChild(parseHtml(
                    '<div class="slbCaption">' + this.captions[position] + '</div>')
                );
            }

            this.loadImage(url, function() {

                self.setImageDimensions();

                callback.call(self, $imageCont);

                self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);

            });

        }

        return this;
    }

    loadImage(url, callback) {
        if (!this.options.videoRegex.test(url)) {

            var image = new Image();
            callback && (image.onload = callback);
            image.src = url;

        }
    }

    setupLightboxHtml() {
        var o = this.options;

        if (!this.$el) {

            this.$el = parseHtml(
                '<div class="slbElement ' + o.elementClass + '">' +
                    '<div class="slbOverlay"></div>' +
                    '<div class="slbWrapOuter">' +
                        '<div class="slbWrap">' +
                            '<div class="slbContentOuter">' +
                                '<div class="slbContent"></div>' +
                                '<button type="button" title="' + o.closeBtnCaption + '" class="slbCloseBtn ' + o.closeBtnClass + '">×</button>' +
                                (this.items.length > 1
                                    ? '<div class="slbArrows">' +
                                         '<button type="button" title="' + o.prevBtnCaption + '" class="prev slbArrow' + o.prevBtnClass + '">' + o.prevBtnCaption + '</button>' +
                                         '<button type="button" title="' + o.nextBtnCaption + '" class="next slbArrow' + o.nextBtnClass + '">' + o.nextBtnCaption + '</button>' +
                                      '</div>'
                                    : ''
                                ) +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            this.$content = this.$el.querySelector('.slbContent');

        }

        this.$content.innerHTML = '';

        return this;
    }

    show() {
        if (!this.modalInDom) {
            
            if (typeof this.options.appendTarget  === 'string') {
                document.querySelector(this.options.appendTarget).appendChild(this.$el);
            } else {
                this.options.appendTarget.appendChild(this.$el);
            }
            addClass(document.documentElement, this.options.htmlClass);
            this.setupLightboxEvents();
            this.modalInDom = true;

        }

        return this;
    }

    setContent(content) {
        var $content = typeof content === 'string'
            ? parseHtml(content)
            : content
        ;

        this.loading(false);

        this.setupLightboxHtml();

        removeClass(this.$content, 'slbDirectionNext');
        removeClass(this.$content, 'slbDirectionPrev');

        if (this.direction) {
            addClass(this.$content, this.direction === 'next'
                ? 'slbDirectionNext'
                : 'slbDirectionPrev'
            );
        }

        if (this.options.beforeSetContent) {
            this.options.beforeSetContent($content, this);
        }

        this.$content.appendChild($content);

        return this;
    }

    setImageDimensions() {
        if (this.$currentImage) {
            this.$currentImage.style.maxHeight = getWindowHeight() + 'px';
        }
    }

    setupLightboxEvents() {
        var self = this;

        if (this.eventRegistry.lightbox.length) {
            return this;
        }

        this.addEvent(this.$el, 'click', function(e) {

            var $target = e.target;

            if (matches($target, '.slbCloseBtn') || (self.options.closeOnOverlayClick && matches($target, '.slbWrap'))) {

                self.close();

            } else if (matches($target, '.slbArrow')) {

                matches($target, '.next') ? self.next() : self.prev();

            } else if (self.options.nextOnImageClick && self.items.length > 1 && matches($target, '.slbImage')) {

                self.next();

            }

        }).addEvent(document, 'keyup', function(e) {

            self.options.closeOnEscapeKey && e.keyCode === 27 && self.close();

            if (self.items.length > 1) {
                (e.keyCode === 39 || e.keyCode === 68) && self.next();
                (e.keyCode === 37 || e.keyCode === 65) && self.prev();
            }

        }).addEvent(window, 'resize', function() {

            self.setImageDimensions();

        });

        return this;
    }

    close() {
        if (this.modalInDom) {

            this.runHook('beforeClose');
            this.removeEvents('lightbox');
            this.$el && this.$el.parentNode.removeChild(this.$el);
            removeClass(document.documentElement, this.options.htmlClass);
            this.modalInDom = false;
            this.runHook('afterClose');

        }

        this.direction = undefined;
        this.currentPosition = this.options.startAt;
    }

    destroy() {
        this.close();
        this.runHook('beforeDestroy');
        this.removeEvents('thumbnails');
        this.runHook('afterDestroy');
    }

    runHook(name) {
        this.options[name] && this.options[name](this);
    }

    static open(options) {

        var instance = new SimpleLightbox(options);

        return options.content
            ? instance.setContent(options.content).show()
            : instance.showPosition(instance.options.startAt);

    };
}

function assign(target) {

    for (var i = 1; i < arguments.length; i++) {

        var obj = arguments[i];

        if (obj) {
            for (var key in obj) {
                obj.hasOwnProperty(key) && (target[key] = obj[key]);
            }
        }

    }

    return target;

}

function addClass(element, className) {

    if (element && className) {
        element.className += ' ' + className;
    }

}

function removeClass(element, className) {

    if (element && className) {
        element.className = element.className.replace(
            new RegExp('(\\s|^)' + className + '(\\s|$)'), ' '
        ).trim();
    }

}

function parseHtml(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();

    return div.childNodes[0];
}

function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
}

function getWindowHeight() {
    return 'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
}

// #########################
//           CSS
// ########################
export const simpleLightBoxStyle = html`
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