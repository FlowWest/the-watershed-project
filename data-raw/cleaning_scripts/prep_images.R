library(tidyverse)
library(stringr)

base_url <- "https://the-watershed-project-app.s3-us-west-2.amazonaws.com/"

read_csv('data-raw/images.csv') %>% 
  mutate(imagePath = str_replace(imagePath, 'jpeg', 'JPG'),
         imageURL = paste0(base_url, imagePath)) %>% 
  write_csv('wq-app-gatsby/src/data/images.csv')

