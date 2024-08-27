forwardMsg <- function() {
  if (!is.null(rmarkdown::metadata$forward)) {
    cat('
  <figure class="figure">
  <figcaption class="forward">',
    rmarkdown::metadata$forward,
  '</figcaption>
  </figure>
    ')
  }
}