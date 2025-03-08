
library(exifr)
library(tidyverse)

descrip_exif <- function(x){
    exif <- exifr::read_exif(
      path = x, 
      tags = c("Model", "FocalLength", "FNumber", "ExposureTime", 
               "ISO", "LensModel", 
               "BatteryLevel", "SelfTimer", "DateTimeOriginal", "OffsetTime")
    )
    
    glue::glue("{exif$Model} / {exif$LensModel} <br>
               {exif$FocalLength}mm f/{exif$FNumber} 1/{round(1/exif$ExposureTime)} ISO {exif$ISO} <br>
               {lubridate::as_datetime(glue::glue('{exif$DateTimeOriginal} {exif$OffsetTime}'))} UTC")
}

images <- list.files("project/fkt250220/species-catalog/Animal-Surface", ".jpg", full.names = T)

file_exif <- read_exif(images)

arg_len <- 4

des <- file_exif$Description %>% str_split(., pattern = ", ", n = arg_len)

des_split <- des %>% map(\(x){
    c(x, rep(NA, arg_len - length(x)))
}) %>% 
    as.data.frame() %>% 
    t() %>% 
    as_tibble() %>%
    `colnames<-`(c("copyright", "common_name", "scientific_name", "stage"))
    


lut <- bind_cols(file_exif, des_split)

lut_args <- lut %>% 
    dplyr::select(c("SourceFile", "common_name", "scientific_name", "stage", "copyright"))

cat_list <- 
    yaml::read_yaml("project/fkt250220/species-catalog/species-category.yaml") %>% bind_rows()

markdown <- lut_args %>% 
    mutate(stage = ifelse(is.na(stage), '', paste0(', ', stage))) %>%
    mutate(markdown = paste(
        '![', 
        common_name, 
        ', *', 
        scientific_name, 
        '*', 
        stage, 
        ' © ',
        copyright,
        '](/', 
        SourceFile, 
        '){description="`r descrip_exif(\'', 
        SourceFile,
        '\')`"}', 
        sep = '')) %>%
    left_join(x = ., y = cat_list, by = "scientific_name")

cats <- unique(markdown$category)

markdown_l <- markdown %>% 
    group_by(category) %>%
    group_map(~ paste(.x$markdown, collapse = "\n\n")) 

cats <- markdown %>% 
    group_by(category) %>% 
    group_keys() %>% 
    .[[1]]



body <- paste("##", cats, '\n\n', markdown_l, sep = ' ') %>% paste(collapse = '\n\n')

write(body, file = "project/fkt250220/species-catalog/species-catalog.qmd")

# print(unique(lut_args$scientific_name))