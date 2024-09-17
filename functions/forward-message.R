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