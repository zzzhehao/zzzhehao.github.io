forwardMsg <- function() {
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
}