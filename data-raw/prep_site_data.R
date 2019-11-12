library(readxl)
library(tidyverse)
library(jsonlite)

excel_sheets('data-raw/WQ data.xlsx')

analytes <- read_excel('data-raw/WQ data.xlsx', 'analytes')
units <- read_excel('data-raw/WQ data.xlsx', 'units') %>% 
  rename(UnitName = Unit, UnitDescription = `Unit description`)

groups <- read_excel('data-raw/WQ data.xlsx', 'groups')

observations_raw <- read_excel('data-raw/WQ data.xlsx', 'Observations')

glimpse(observations_raw)

observations_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result = VariableResult) %>% 
  filter(Result != "Not Recorded") %>% pull(AnalyteName) %>% unique
  group_by(StationCode, AnalyteName) %>% 
  nest() %>% 
  toJSON() #%>% 
  # write_json('wq-app-gatsby/src/data/habitat_data.json')

field_results_raw <- read_excel('data-raw/WQ data.xlsx', 'Measurements')
glimpse(field_results_raw)

field_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result) %>% 
  left_join(analytes) %>% 
  mutate(AnalyteName = Name) %>% 
  select(-Name) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  filter(!is.na(AnalyteName), !is.na(Result)) %>% 
  group_by(StationCode, AnalyteName, UnitName, UnitDescription, category) %>% 
  nest() %>% 
  toJSON() #%>% 
    # write_json('wq-app-gatsby/src/data/field_data.json')
