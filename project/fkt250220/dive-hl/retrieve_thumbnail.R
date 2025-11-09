
library(tidyverse)
library(readxl)
library(knitr)
library(kableExtra)

HL.summary.w <- readRDS("project/fkt250220/dive-hl/HL.rds")

HL.summary.w <- HL.summary.w %>%
    mutate(FileID = paste(HL.summary.w$DiveID, HL.summary.w$OpSerialNo, sep = "_")) %>%
    filter(is.na(`In summary`))

# resize and copy thumbnail

thumbnailName <- list.files('/Volumes/T7/SSI Media/SuBastian/DiveHighlight_Thumbnail')

library(magick)
walk(thumbnailName, \(x) {
    thumbnailID <- str_extract(x, "^S0[0-9]{3}_[0-9]{1,3}")

    if (thumbnailID %in% HL.summary.w$FileID) {
        xPath <- paste0("/Volumes/T7/SSI Media/SuBastian/DiveHighlight_Thumbnail/", x)
        img <- image_read(xPath)
        img_resized <- image_resize(img, "1920x")
        image_write(img_resized, path = paste0("project/fkt250220/dive-hl/thumbnails/", x))
    }
})
