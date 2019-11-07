library(tidyverse)
library(jsonlite)

creeks <- read_csv('data-raw/creeks.csv')
creeks_to_sites <- read_csv('data-raw/creeks_to_sites.csv')
sites <- read_csv('data-raw/sites.csv') %>%
  mutate(description = str_remove(description, 'Please.+'))
site_locations <- read_csv('data-raw/site_locations.csv')


creeks_to_sites %>%
  left_join(creeks) %>%
  left_join(sites) %>%
  left_join(site_locations) %>%
  group_by(creek_name, creek_description, creek_id) %>%
  nest(.key = 'sites') %>%
  toJSON()
