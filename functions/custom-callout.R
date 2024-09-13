# Currently a new custom callout is not supported. This workaround uses the least used callout .callout-caution to mimic a custom callout
# see: https://stackoverflow.com/questions/74647399/define-a-new-callout-in-quarto

#' @param title Title.
#' @param content Content in Markdown.
#' @param icon Icon to display at icon container.
#' @param collapse Default to TRUE.
#' @param colorstyle API to override font/border and background color, input should be string, which will pass to Quarto fence container. Use `var(--clcolor)` for font/border color and `var(--clgb)` for background color. 
#' @param style Additional css styling, will be pass to `style=""`.

custom_callout <- function(title, content, icon, collapse=TRUE, colorstyle=NULL, style=NULL) {
    if (missing(icon)) {icon='false'}
    if (collapse) {collapse <- 'true'} else {collapse <- 'false'}
    style <- paste0(style, 'border-left: none; border: 1px solid var(--clcolor);')
    

    cat(
    '::: {.callout-caution appearance="minimal" icon="',
    icon,
    '" title="',
    title,
    '" ',
    colorstyle,
    ' collapse="',
    collapse,
    '" style="',
    style,
    '"}
    
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