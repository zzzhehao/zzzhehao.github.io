# zzzhehao.github.io

![LICENSE](https://img.shields.io/badge/License-MIT-orange)

This is the source code for my website [zzzhehao.github.io](https://zzzhehao.github.io), feel free to share and use.


## Quarto

I use [Quarto](https://quarto.org) to build this website. There are many [beautiful examples](https://quarto.org/docs/gallery/#websites) made by Quarto. 

### Extensions

Extensions used here are listed as below:

- [openlinksinnewpage](https://github.com/davidwilby/openlinksinnewpage) by davidwilby
- [closeread](https://github.com/qmd-lab/closeread#readme) by qmd-lab
    - modified
- [quarto-nutshell](https://github.com/schochastics/quarto-nutshell#readme) by schochastics
- [iconify](https://github.com/mcanouil/quarto-iconify) by Mickaël CANOUIL

### Functions

There are some handy functions I wrote at `functions/` to assist my work.

- `custom-callout.R` True custom callout is currently not supported. I use less used callout-caution for my custom use. Detailes are described in roxygen2 style in script.
- `forward-message.R` Custom class element. Print out `description` of page's yaml header. See [here](/biology-research/asbiologist.qmd).
- `mapping-assist-shiny.R` A shiny app that helps cropping image using margin percentage. Helpful when using `data-crop` method in closeread (modified).
