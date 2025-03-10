library(tidyverse)
library(magrittr)
lizards <- readRDS("biology-research/community-ecology/assets/data/jornada.lizard.rds")

lizards %<>% mutate(year = factor(year(date)), .after = date)

str(lizards)
summary(lizards$spp)

head(lizards, n = 20)

# Clean data
lizards.clean <- lizards %>% 
    filter(
        spp != "NONE" &
        !is.na(zone) &
        !is.na(site) &
        !is.na(rcap)
    )

head(lizards.clean, n = 30)

## NMDS
library(vegan)

# Create community data for each year
lizards.community <- lizards.clean %>%
    nest(.by = year) %>%
    mutate(community = map(data, \(df) {
        df %>%
            pivot_wider(names_from = spp, values_from = rcap, 
                    values_fn = list(rcap = ~ any(. == 'N'))) %>%
            group_by(site) %>%
            summarise(across(where(is.logical), \(x) sum(x, na.rm = TRUE)))
    }))
lizards.community

# Convert to community matrix
lizards.community <- lizards.community %>%
    mutate(matrix = map(community, \(df) {
        name <- df[[1]]
        df %>%
            select(where(is.numeric)) %>%
            as.matrix() %>%
            `row.names<-`(name)
    }))

zone <- 
    lizards.clean %>% 
    pivot_wider(names_from = spp, values_from = rcap, 
        values_fn = list(rcap = ~ any(. == 'N'))) %>%
    group_by(site, zone) %>%
    summarise(across(where(is.logical), \(x) sum(x, na.rm = TRUE))) %>%
    .[,1:2]
zone

liz <- map(lizards.community$community, \(x) x[, 2:ncol(x)])

# set.seed(2000)
# set.seed(2024)
# 
# lizards.community <- lizards.community %>%
#     mutate(
#         nmds = map(matrix, \(m) {
#             nmds <- m %>% metaMDS(k = 2, autotransform = F)
#         }),
#         score = map(nmds, \(n) {
#             score <- scores(n)
#             sites <- rownames(score$sites)
#             score$sites <- score$sites %>%
#                 as.tibble() %>%
#                 mutate(site = sites)
#             score$sites <- left_join(score$sites, zone, by = "site")
#             score$species <- score$species %>%
#                 as.data.frame() %>%
#                 mutate(species = rownames(score$species))
#             score
#         })
#     )
# 
# 
# draw_nmds <- function(ls, nmds, year) {
#     ggplot() +
#         geom_point(data = ls$sites, aes(x = NMDS1, y = NMDS2, fill = zone), color = "black", shape = 21) +
#         geom_point(data = ls$species, aes(x = NMDS1, y = NMDS2), color = "red", shape = 3) +
#         labs(title = paste('Year', year, '- Stress:', round(nmds$stress, digit = 4), collapse = ' '))
# }
# 
# draw_nmds_text <- function(ls, nmds, year) {
#     ggplot() +
#         geom_text(data = ls$sites, aes(x = NMDS1, y = NMDS2, fill = zone, label = site), color = "black", shape = 21, check_overlap = T) +
#         geom_text(data = ls$species, aes(x = NMDS1, y = NMDS2, label = species), color = "red", shape = 3, check_overlap = T) +
#         labs(title = paste('Year', year, '- Stress:', round(nmds$stress, digit = 4), collapse = ' '))
# }
# 
# lizards.community <- lizards.community %>%
#     mutate(plot = pmap(list(score, nmds, year), \(score_ls, nmds, year) draw_nmds_text(score_ls, nmds, year)))
# 
# 
# library(gridExtra)
# plot <- do.call(grid.arrange, c(lizards.community$plot, ncol = 2))
# ggsave("biology-research/community-ecology/lizard.png", plot, width = 40, height = 100, units = 'cm')
# 
# lizards.community %>% filter(year == 1993) %>% .$score
# 
# lizards.community$community[[1]] %>% .[, 2:ncol(.)]
