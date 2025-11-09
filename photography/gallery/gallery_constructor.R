source("confidential/imagekit_API.R")

library(tidyverse)
library(jsonlite)
library(reticulate)

local_files <- list.files("assets/gallery", pattern = "\\.jpg$", full.names = T, recursive = T) %>% gsub("^assets", "", .)

# Check all albums are registered by Python script

album.names <- local_files %>% 
    str_split("/", simplify = T) %>% 
    as.data.frame() %>% 
    filter(str_detect(.$V4, "\\.jpg$", negate = T)) %>%
    pull(V4) %>%
    unique() 

album.names <- album.names[!album.names %in% c("blue-marble")] # shit code, change blue-marble implementation

album.registered <- fromJSON(readLines("gallery/gallery_metadata.json"))$name

album.registered <- album.registered[!album.registered %in% c("blue-marble")] # shit code, change blue-marble implementation

if (!any(!album.names %in% album.registered)) {cat("All up-to-date.")} else {
    not.registered <- album.names[!album.names %in% album.registered] 
    cat(paste0("Album ", not.registered, " not registered, now running gallery-meta.py ..."))
    py_run_file("gallery/gallery-meta.py")
}

# Check if all album has thumbnail

thumbnails <- local_files %>% 
    str_split("/", simplify = T) %>% 
    as.data.frame() %>% 
    filter(V3 == "thumbnails") %>% 
    pull(V4) %>%
    gsub("\\.jpg$", "", .)

if (!any(!thumbnails %in% album.registered)) {cat("All up-to-date.")} else {
    not.registered <- thumbnails[!thumbnails %in% album.registered]
    warning(paste0("Album ", not.registered, " does not have thumbnail."))
}

# Check all images are on imagekit

local_files <- list.files("assets/gallery", pattern = "\\.jpg$", full.names = T, recursive = T) %>% gsub("^assets", "", .) # Update list in case thumbnail has been added

imagekit.list <- get_imageList() %>%
    filter(mime == "image/jpeg")

filePath <- imagekit.list$filePath

if (!any(!local_files %in% filePath)) {cat("All up-to-date.")} else {
    not.uploaded <- local_files[!local_files %in% filePath]
    warning.txt <- paste0(not.uploaded, collapse = "\n")   
    warning(paste0("Following files are not uploaded to imagekit: \n\n", warning.txt, collapse = ""))
}

not.uploaded
