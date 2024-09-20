#' Print Forward Message.
#' 
#' @param msg Message to print. If not proviede, use description in YAML header.
#' 
forwardMsg <- function(msg) {
    if (missing(msg)) {
        if (!is.null(rmarkdown::metadata$description)) {
            cat('
<figure class="figure">
<figcaption class="forward">',
            rmarkdown::metadata$description,
'</figcaption>
</figure>
            '    
            )
            }
    } else {
            cat('
<figure class="figure">
<figcaption class="forward">',
            msg, 
'</figcaption>
</figure>
            '    
            )
    }
}

#' Print out R session info and package citations
#' 
#' @param pkgs A vector of package names.
r_pkg_info <- function(pkgs) {
    cat('#### R session \n\n')

    si <- sessionInfo()
    si$loadedOnly <- NULL
    print(si)

    cat('\n\n#### Packages \n\n')

    for (pkg in pkgs) {
    cat("\n\n**", pkg, "**\n\n", sep = '')

        # Print version
    tryCatch({
        version <- as.character(packageVersion(pkg))
        cat("\nVersion:", version, "\n\n")
    }, error = function(e) {
        cat("\nVersion information not available\n\n")
    })
    
    # Print citation
    tryCatch({
        cite <- citation(pkg)
        print(cite, style = "text")
    }, error = function(e) {
        cat("Citation not available\n")
    })
    }
}

# Currently a new custom callout is not supported. This workaround uses the least used callout .callout-caution to mimic a custom callout
# see: https://stackoverflow.com/questions/74647399/define-a-new-callout-in-quarto

#' @param title Title.
#' @param content Content in Markdown.
#' @param iconify Iconify icon to display in title.
#' @param collapse Default to TRUE.
#' @param colorstyle API to override font/border and background color, input should be string, which will pass to Quarto fence container. Use `var(--clcolor)` for font/border color and `var(--clgb)` for background color. 
#' @param style Additional css styling, will be pass to `style=""`.

custom_callout <- function(title, content, iconify, collapse=TRUE, colorstyle=NULL, style=NULL, titleStyle) {
    if (missing(titleStyle)) {
        titleStyle <- "{.cl-title}"
    } else if (titleStyle == "sub") {
        titleStyle <- "{.cl-sub}"
    }
    if (missing(iconify)) {iconify <- ''} else {
        iconify <- paste0('{{< iconify ', iconify, ' >}} ')
    }
    if (collapse) {collapse <- 'true'} else {collapse <- 'false'}
    style <- paste0(style, 'border-left: none; border: 1px solid var(--clcolor);')
    

    cat(
    '::: {.callout-caution appearance="minimal" ',
    colorstyle,
    ' collapse="',
    collapse,
    '" style="',
    style,
    '"}
    
', '## [',
    iconify,
    title,
    ']',
    titleStyle,
'
    
',  
    content,
    '
    
:::',
    sep = '')
}

# ```{r}
# #| output: asis
# #| echo: false
# source("functions/custom-callout.R")
# content <- ""
# custom_callout("New Disclaimer", content, collapse = FALSE)
# ```