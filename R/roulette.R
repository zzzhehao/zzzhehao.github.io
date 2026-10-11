#' Insert Roulette
#' @export
insert_roulette <- function(yaml_path, id) {
    # 1. Load Data
    roulette_data <- yaml::read_yaml(yaml_path)
    
    if (is.null(roulette_data[[id]])) {
      return(htmltools::div(style="color:red", paste("Error: ID", id, "not found.")))
    }
    
    album <- roulette_data[[id]]
    images <- album$images

    images <- lapply(images, function(img) {
      if (!is.null(img$caption)) {
        # Render markdown to HTML
        html_caption <- commonmark::markdown_html(img$caption)
        # Optional: Remove wrapping <p> tags if you prefer inline style
        # html_caption <- gsub("^<p>|</p>\\n$", "", html_caption) 
        img$caption <- html_caption
      }
      return(img)
    })
    
    # 2. Prepare Data for JS
    json_data <- jsonlite::toJSON(images, auto_unbox = TRUE)
    
    # 3. Create the Dependency
    roulette_dep <- htmltools::htmlDependency(
      name = "roulette-module",
      version = "1.1.0",
      src = c(file = system.file("roulette", package = "zWeb")),
      script = "roulette.js"
    )
    
    # 4. Create Structure
    html_content <- htmltools::div(
      id = paste0("roulette-", id),
      class = "roulette-container",
      `data-images` = json_data,
      
      htmltools::div(
        class = "roulette-stage"
        # Buttons removed here
      ),
      
      htmltools::div(
        class = "roulette-thumbnails",
        htmltools::div(class = "r-track") # Explicitly creating track div here if preferred, or let JS do it
      ),
      
      htmltools::div(
        class = "roulette-caption",
        htmltools::div(class = "caption-text", htmltools::HTML(images[[1]]$caption))
      )
    )
    
    return(htmltools::tagList(html_content, roulette_dep))
  }