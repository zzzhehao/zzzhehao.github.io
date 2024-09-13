library(shiny)
library(bslib)
library(tidyverse)
library(ggimage)
library(jpeg)
library(png)
library(grid)

ui <- fluidPage(
    sidebarLayout(
        sidebarPanel = fileInput(inputId = "file",
            label = "Upload an image",
            multiple = FALSE,
            accept = c("png")),
        mainPanel = plotOutput(outputId = "Plot")
    )
)

server <- function(input, output, session) {
    output$Plot <- renderPlot({
        img <- readPNG(input$file$datapath)
        g <- rasterGrob(img, interpolate=TRUE, width=unit(1,"npc"), height=unit(1,"npc"))
        ggplot() +
            annotation_custom(g, xmin=0, xmax=1, ymin=0, ymax=1) +
            scale_x_continuous(limits = c(0, 1), breaks = c(1:10)/10) +
            scale_y_continuous(limits = c(0, 1), breaks = c(1:10)/10) +
            coord_fixed(ratio = 1)
    })
}

shinyApp(ui, server)
