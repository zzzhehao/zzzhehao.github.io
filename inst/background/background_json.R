source("confidential/imagekit_API.R")

update_background_json <- function() {
  
    # 1. Call the fetcher function
    cat("Fetching full image list...\n")
    image_data <- get_imageList()
    
    # 2. Extract only the URLs (and filter if needed)
    # You can add tidyverse filters here, e.g., filter(!str_detect(name, "test"))
    url_list <- image_data %>% 
        filter(str_detect(filePath, "/assets/background")) %>%
        pull(url)
    
    # 3. Write to JSON
    output_path <- "assets/backgrounds.json"
    
    write_json(url_list, output_path, pretty = TRUE, auto_unbox = TRUE)
    
    cat(sprintf("DONE! %d images saved to '%s'\n", length(url_list), output_path))
}

update_background_json()
