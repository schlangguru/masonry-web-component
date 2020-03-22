# SC Masonry
SC Masonry is a web component to easily build a masonry photo gallery.

## Features
- Responsive
- Choose between
  - fixed number of columns with variable image width
  - variable number of columsn width fixed image width
- Lightbox support

## Usage
```html
<!-- import web component -->
<script type="module" src="/path/to/ScMasonry.js"></script>

<!-- use it -->
<sc-masonry>
  <sc-masonry-img src="/img1" caption="My Image"></sc-masonry-img>
  <sc-masonry-img src="/img2" caption="My Image"></sc-masonry-img>
  <sc-masonry-img src="/img3" caption="My Image"></sc-masonry-img>
  ...
</sc-masonry>
```

## API

### Tag `sc-masonry`

| Attribute    | Description                                                     | Default |
|--------------|-----------------------------------------------------------------|---------|
| columns      | Fixed number of columns. Images will be sized automatically.    | `3`     |
| column-width | Fixed image width. Number of columns will be set automatically. | `250px` |
| gutter       | Space between images.                                           | `0`     |
| lightbox     | Enables lightbox.                                               | `false` |

Use either `columns` or `column-width` attribute.

### Tag `sc-masonry-img`

| Attribute | Description                                    | Default |
|-----------|------------------------------------------------|---------|
| src       | URL of the image.                              | `3`     |
| caption   | Used as `img alt` and caption of the lightbox. | `250px` |

## Development
```bash
# install all dependencies
`npm install` 
# build web component
`npm run build`
# watch for file changes -> run build on change
`npm run watch`
# start demo server
`npm run serve`
```