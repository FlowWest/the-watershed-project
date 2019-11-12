library(readxl)
library(tidyverse)
library(jsonlite)

excel_sheets('data-raw/WQ data.xlsx')

analytes <- read_excel('data-raw/WQ data.xlsx', 'analytes')
units <- read_excel('data-raw/WQ data.xlsx', 'units') %>% 
  rename(UnitName = Unit, UnitDescription = `Unit description`)

groups <- read_excel('data-raw/WQ data.xlsx', 'groups')

creeks_to_stations <- read_csv('data-raw/creeks_to_sites.csv') %>% 
  rename(StationCode = site_id)

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

d <- field_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result) %>% 
  left_join(analytes) %>% 
  left_join(creeks_to_stations) %>% 
  mutate(AnalyteName = Name) %>% 
  select(-Name) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  filter(!is.na(AnalyteName), !is.na(Result))

d %>% 
  group_by(StationCode, AnalyteName) %>% 
  summarise(count= n()) %>% 
  spread(AnalyteName, count) %>% View

unique(d$AnalyteName)

d %>%
  filter(AnalyteName == 'Specific Conductivity') %>% 
  mutate(yup = between(Result, 150, 500)) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'pH') %>% 
  mutate(yup = between(Result, 6.5, 9)) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Dissolved Oxygen') %>% 
  mutate(yup = Result > 5) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Turbidity') %>% 
  mutate(yup = Result < 10) %>%
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Nitrate') %>% 
  mutate(yup = Result < .5) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Copper') %>% 
  mutate(yup = Result < 13) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Lead') %>% 
  mutate(yup = Result < 65) %>% 
  summarise(mean(yup))

d %>%
  filter(AnalyteName == 'Mercury') %>% 
  mutate(yup = between(Result, .77, 1.4)) %>% 
  summarise(mean(yup))

d %>% 
  filter(AnalyteName == 'Diesel Fuel') 

d %>% 
  group_by(creek_id, StationCode, AnalyteName) %>% 
  summarise(count = n()) %>% 
  spread(AnalyteName, count) %>% View
filter(AnalyteName == 'pH') %>% 
  mutate(yup = between(Result, 6.5, 9)) %>% 
  summarise(mean(yup))


d %>% 
  mutate(acceptable = case_when(
    AnalyteName == 'Specific Conductivity' & between(Result, 150, 500) ~ TRUE,
    AnalyteName == 'pH' & (Result < 6.5 | Result < 9) ~ TRUE,
    AnalyteName == 'Dissolved Oxygen' & Result < 5 ~ TRUE,
    AnalyteName == 'Temperature' & Result < 24 ~ TRUE,
    AnalyteName == 'Turbidity' & Result < 10 ~ TRUE
  ))

