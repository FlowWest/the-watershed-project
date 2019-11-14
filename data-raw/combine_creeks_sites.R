library(tidyverse)
library(jsonlite)

creeks <- read_csv('data-raw/creeks.csv')
creek_lat_longs <- read_csv('data-raw/twp_creek_geodata_20191111/twp_creek_zoom_points.csv') %>% 
  rename(creek_lat = lat, creek_long = long)
creeks_to_sites <- read_csv('data-raw/creeks_to_sites.csv')
sites <- read_csv('data-raw/sites.csv') %>%
  mutate(description = str_remove(description, 'Please.+'))
site_locations <- read_csv('data-raw/site_locations.csv')

creeks_to_sites %>%
  left_join(creeks) %>%
  left_join(creek_lat_longs) %>% 
  left_join(sites) %>%
  left_join(site_locations) %>% 
  unique() %>% 
  group_by(creek_name, creek_description, creek_id, creek_lat, creek_long) %>% 
  nest(.key = 'sites') %>%
  toJSON() #creek_site.json


sites %>% 
  left_join(creeks_to_sites) %>% 
  left_join(creeks) %>%
  select(-creek_description) %>% 
  toJSON() #sites.json
