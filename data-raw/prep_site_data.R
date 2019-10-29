library(readxl)
library(tidyverse)
library(jsonlite)

excel_sheets('data-raw/Data_for_CEDEN_-_Sep_2018_to_Apr_2019.xlsx')

habitat_results_raw <- read_excel('data-raw/Data_for_CEDEN_-_Sep_2018_to_Apr_2019.xlsx', 'HabitatResults')

glimpse(habitat_results_raw)

habitat_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, VariableResult) %>% 
  filter(VariableResult != "Not Recorded") %>% 
  group_by(StationCode, AnalyteName) %>% 
  nest() %>% 
  toJSON() #%>% 
  # write_json('wq-app-gatsby/src/data/habitat_data.json')

field_results_raw <- read_excel('data-raw/Data_for_CEDEN_-_Sep_2018_to_Apr_2019.xlsx', 'FieldResults')
glimpse(field_results_raw)

field_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result) %>% 
  mutate(AnalyteName = case_when(
    AnalyteName == 'Oxygen, saturation' ~ 'Oxygen, Saturation',
    AnalyteName == "SpecificConductivity" ~ "Specific Conductivity", 
    TRUE ~ AnalyteName
  )) %>% 
  group_by(StationCode, AnalyteName, UnitName) %>% 
  nest() %>% 
  toJSON() #%>% 
# write_json('wq-app-gatsby/src/data/field_data.json')

