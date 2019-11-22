library(tidyverse)
library(jsonlite)

creeks <- read_csv('data-raw/creeks.csv')
creek_lat_longs <- read_csv('data-raw/twp_creek_geodata_20191111/twp_creek_zoom_points.csv') %>% 
  rename(creek_lat = lat, creek_long = long)
creeks_to_sites <- read_csv('data-raw/creeks_to_sites.csv')
sites <- read_csv('data-raw/sites.csv') %>%
  mutate(description = str_remove(description, 'Please.+')) %>% 
  separate(name, into = c('creek', 'label'), ' at ', remove = FALSE) %>% 
  select(-creek)
site_locations <- read_csv('data-raw/site_locations.csv')

creeks_to_sites %>%
  left_join(creeks) %>%
  left_join(creek_lat_longs) %>% 
  left_join(sites) %>%
  left_join(site_locations) %>% 
  unique() %>% 
  group_by(creek_name, creek_description, creek_id, creek_lat, creek_long) %>% 
  nest(.key = 'sites') %>%
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/creek_site.json')

sites %>% 
  left_join(creeks_to_sites) %>% 
  left_join(creeks) %>%
  select(-creek_description) %>% 
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/sites.json')

sites %>%
  select(StationCode = site_id, label) %>%
  write_rds('data/site_id_to_label.rds')

ceden_stations <- read_rds('data/ceden_stations.rds') %>% 
  mutate(name = StationName, label = NA, description = NA, site_id = StationCode,
         creek_id = NA, creek_name = NA, source = 'CEDEN') %>% 
  select(name, label, description, site_id, creek_id, creek_name, lat, long, source)

sites %>% 
  left_join(creeks_to_sites) %>% 
  left_join(creeks) %>%
  left_join(site_locations) %>% 
  select(-creek_description) %>% 
  mutate(source = 'The Watershed Project') %>% 
  bind_rows(ceden_stations) %>% 
  write_csv('wq-app-gatsby/src/data/twpCedenSites.csv')
