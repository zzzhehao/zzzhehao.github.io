---
title: "Comment 1 - Constructing gallery"
author: "Zhehao Hu"
---

This comment notes some insights while trying to construct the gallery (`gallery/index.qmd` and its belongings).

### 2024/07/14

1. Quarto is sensitive to tabs, especially when dealing with html. If seeing html code printed out in the preview, try delete tabs in the line. Sometimes three tabs can already cause difference.
2. Quarto may need some other effort to let JS be called in .qmd using html `<script>` and operate. 
    - see [here](https://github.com/quarto-dev/quarto-cli/discussions/4179) and maybe also [here](https://forum.posit.co/t/quarto-equivalent-to-exclude-yaml-command-in-distill/148758).
3. An example may involving batch construct [here](https://b.bapt.xyz/posts/gallery/#generating-the-page-with-quarto)
4. A brilliant show case of automatically extracting photo exif and showing them while inspecting photo, can maybe used otherwise, [example](https://rfsaldanha.github.io/photos/photos.html) and [source code](https://github.com/rfsaldanha/rfsaldanha.github.io/blob/main/photos/photos.qmd) 
5. Also see [lightbox tool](https://github.com/quarto-ext/lightbox?tab=readme-ov-file)
6. **Design**: [hamada hideaki](https://github.com/quarto-ext/lightbox?tab=readme-ov-file) 

### 2024/07/19

1. Quarto treats Javascript differently (although I don't know Javascript at all but certainly it is a bit more complex than in pure html), use following front matter yaml header to include the script:
```yaml
include-after-body: 
  - text: |
      <script src="gallery.js"></script>
```
2. Don't ask me about the Javascript, Css and HTML in this gallery project -- I asked [Perplexity](https://perplexity.ai), I really have no idea in front end development, but I do recommend Perplexity for coding and information searching -- it is really powerful.

### 2024/07/22

1. It has become a bit confusing for me about where I should store the picture inside quarto website. At the beginning I somehow realized that the picture is rendered (or "called") once the quarto has converted .qmd into html, so it should be stored under `_site/` and the pathway should be in term of the relative path there from responsible html file. But as I accidentally tried `$ quarto render --cache-refresh` today it deleted every image under `_site/`, I think quarto just reset `_site/` and then re-rendered the whole website. And when I tried to preview my page, I noticed the error in console that the image was actually called directly from quarto project root.
- So I stored my image earlier at `root/_site/image/my-photos.jpg`, but the error message said that quarto was trying to find the image at `root/image/my-photos.jpg`.

2. Turned out the quarto might has set `_site` as the root while rendering, not the project root, so in the error message the file path went directly from `_site/`. So in conclusion, use `$ quarto render --cache-refresh` carefully, it will delete all images.