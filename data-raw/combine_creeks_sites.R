library(tidyverse)
library(jsonlite)

creeks <- read_csv('data-raw/creeks.csv')
creeks_to_sites <- read_csv('data-raw/creeks_to_sites.csv')
sites <- read_csv('data-raw/sites.csv')

creeks_to_sites %>% 
  left_join(creeks) %>% 
  left_join(sites) %>% 
  group_by(creek_name, creek_description, creek_id) %>% 
  nest(.key = 'sites') %>% 
  toJSON() 
  
