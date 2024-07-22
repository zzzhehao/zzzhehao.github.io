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
2. I asked [Perplexity](https://perplexity.ai) a lot while constructing my site, I really have no idea in front end development, but I do recommend Perplexity for coding and information searching -- it is really powerful.

### 2024/07/22 !! important

- For everyone have assets in their webstie, spend some time reading [Quarto documentation](https://quarto.org/docs/websites/website-tools.html#site-resources).
- I was confused as hell today as every time I run `$ quarto render` it just delete every image I stored under `_site/`, then I realized the way that I managed the assets must not have been legitimate. So even though this took me whole night to figure out but it certainly prevented a huge mess up in the foreseeable future.
- Briefly, put all assets file outside the output file and manage as you want, but specify them in `_quarto.yml` using 'resource' option, incase you somehow not direclty linked them (e.g. my gallery's full-screen view is calling those images via JavaScript). Everything under 'resource' option will be forcibly exported by quarto in its output and could be used normally. I think this should be the most legitimate way that won't mess up in the future.
- Honestly, I rolled back like 5 times this evening to find this out.