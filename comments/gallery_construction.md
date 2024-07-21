This comment notes some insight while trying to construct gallery (gallery/index.qmd and its belongings).

### 2024/07/14

1. Quarto is sensitive to tabs, especially when dealing with html. If see html code in preview, try delete tabs in the line. 
2. Quarto may need some other effort to let JS script be called in .qmd using html `<script>` and operate. 
    - see [here](https://github.com/quarto-dev/quarto-cli/discussions/4179) and maybe also [here](https://forum.posit.co/t/quarto-equivalent-to-exclude-yaml-command-in-distill/148758).
3. An example may involving batch construct [here](https://b.bapt.xyz/posts/gallery/#generating-the-page-with-quarto)
4. A brilliant show case of automatically extract photo exif and show them while inspecting photo, can maybe used otherwise, [example](https://rfsaldanha.github.io/photos/photos.html) and [source code](https://github.com/rfsaldanha/rfsaldanha.github.io/blob/main/photos/photos.qmd) 
5. Also see [lightbox tool](https://github.com/quarto-ext/lightbox?tab=readme-ov-file)
6. **Design**: [hamada hideaki](https://github.com/quarto-ext/lightbox?tab=readme-ov-file) 

### 2024/07/19

1. Quarto treats Javascript differently (although I don't know Javascript at all but certainly it is a bit complexer than in pure html), use following front matter yaml header to include the script:
```yaml
include-after-body: 
  - text: |
      <script src="gallery.js"></script>
```
2. Don't ask me about the Javascript, Css and HTML in this gallery project -- I asked [Perplexity](https://perplexity.ai), I really have no idea in front end development, but I do recommend Perplexity for coding and information searching -- it is really powerful.
