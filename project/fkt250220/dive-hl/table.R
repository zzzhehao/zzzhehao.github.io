
library(tidyverse)
library(readxl)
library(knitr)
library(kableExtra)

HL.summary <- read_xlsx("project/fkt250220/dive-hl/Highlight Summary Spreadsheet.xlsx", sheet = "Highlight_meta")

HL.summary <- HL.summary %>%
    mutate(FileID = paste(HL.summary$DiveID, HL.summary$OpSerialNo, sep = "_"))

toWebsite <- "project/fkt250220/dive-hl/"

write_rds(HL.summary, paste0(toWebsite, "HL.rds"))


HL.summary.w <- readRDS("project/fkt250220/dive-hl/HL.rds")

HL.summary.w <- HL.summary.w %>%
    mutate(FileID = paste(HL.summary.w$DiveID, HL.summary.w$OpSerialNo, sep = "_")) %>%
    filter(is.na(`In summary`))

## Prepare image linkes

ThumbnailLinkWeb <- map_chr(1:nrow(HL.summary.w), \(x) {
    list.files(
        'project/fkt250220/dive-hl/thumbnails/', 
        pattern = paste0("^", HL.summary.w[x,]$FileID, "_", collapse = ""), full.names = T)
}) 

ThumbnailLinkWeb <- gsub(" ", "%20", ThumbnailLinkWeb)
ThumbnailLinkWeb <- paste0("/", ThumbnailLinkWeb)

HL.summary.w <- HL.summary.w %>%
    mutate(
        ThumbnailLinkWeb = ThumbnailLinkWeb,
        markdownTxt = paste0("![", Title, "](", ThumbnailLinkWeb, '){width="100%"}'),
        Summary_text = case_when(
            is.na(Summary_text) ~ "",
            .default = Summary_text
        )
    )

# Calculating replay url

youtube <- yaml::read_yaml("project/fkt250220/dive-hl/replay-meta.yml") %>% bind_rows()

youtube.cl <- youtube %>% 
    mutate(
        Start_UTC = ymd_hms(Start_UTC),
        Length = hms::as_hms(Length) %>% seconds_to_period(),
        ID = paste0("S0", Dive, "P", part)
    ) %>% 
    mutate(
        End_UTC = Start_UTC + Length
    )

youtubeID <- map_dfr(1:nrow(HL.summary.w), \(x) {
    entry <- HL.summary.w[x,]
    bef <- entry$HL.start > youtube.cl$Start_UTC
    aft <- entry$HL.start < youtube.cl$End_UTC
    ID <- youtube.cl$ID[as.logical(bef*aft)]
    ID <- ifelse(is.null(ID), "NA", ID)
    sec <- ifelse(ID == "NA", "NA", period_to_seconds(as.period(entry$HL.start - youtube.cl[youtube.cl$ID == ID,]$Start_UTC)))
    data.frame(ID, sec)
    url <- ifelse(ID == "NA", "NA", paste0(youtube.cl[youtube.cl$ID == ID,]$url, "?t=", sec))
    data.frame(ID, sec, url)
})

HL.summary.w <- bind_cols(HL.summary.w, youtubeID)

DiveSite <- c(
    "S0797" = "Humpback Ridge",
    "S0798" = "Montagu Island East",
    "S0799" = "Montagu Bank",
    "S0800" = "South Trench Site",
    "S0801" = "North Trench Site",
    "S0802" = "Minke Seamount",
    "S0803" = "Saunders Island East",
    "S0804" = "Quest Caldera",
    "S0805" = "Mystery Ridge"
)

write("", "project/fkt250220/dive-hl/table.qmd")

walk(unique(HL.summary.w$DiveID), \(x) {
    HL.summary.w.sub <- HL.summary.w %>% filter(DiveID == x)
    tbl <- c(
        paste0("## **", x, ' ', DiveSite[x], "**"),
        paste(
            paste0(
                paste0("### ", HL.summary.w.sub$Title, "\n\n"),
                # paste0("- Highlight ID: ", HL.summary.w.sub$FileID, "\n"),
                paste0("- Time stamp: ", HL.summary.w.sub$HL.start, " UTC"),
                ifelse(!is.na(HL.summary.w.sub$Sp), paste0("\n- ", HL.summary.w.sub$Sp), ""),
                ifelse(
                    !is.na(HL.summary.w.sub$sec), 
                    paste0("\n- Replay: [Youtube](", HL.summary.w.sub$url, ")"), 
                    ""),
                "\n\n", HL.summary.w.sub$markdownTxt, 
                "\n\n",
                HL.summary.w.sub$Summary_text, 
                collapse = "<hr> \n\n"
            )),
        collapse = "\n\n")
    tbl <- paste(tbl, collapse = "\n\n")
    write(tbl, "project/fkt250220/dive-hl/par_table.qmd", append = T)
})
