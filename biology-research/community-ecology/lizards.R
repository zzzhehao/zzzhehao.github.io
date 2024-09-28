library(tidyverse)
library(magrittr)
lizards <- readRDS("biology-research/community-ecology/assets/data/jornada.lizard.rds")

View(lizards)

head(lizards)

lizards %<>% mutate(year = factor(year(date)), .after = date)

str(lizards)
summary(lizards$year)

unique(year(lizards$date))
