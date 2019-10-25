library(tidyverse)
library(jsonlite)

wq_categories <- read_csv('data-raw/wq_categories.csv') 

wq_features <- read_csv('data-raw/wq_features.csv') %>% 
  rename(feature_description = description)

data <- wq_features %>% 
  left_join(wq_categories) 

data %>% 
  group_by(category, description) %>% 
  nest(.key = "features") %>% 
  toJSON() #%>% 
  write_json('wq-app-gatsby/src/data/wq_categories_features.json')
