library(tidyverse)
library(readxl)
library(lubridate)
library(jsonlite)

# The Watershed Project creek and site metadata -----
creeks <- read_csv('data-raw/creeks.csv')
sites <- read_csv('data-raw/sites.csv') 

creeks %>% 
  left_join(sites) %>%
  unique() %>% 
  group_by(creek_name, creek_description, creek_id, creek_lat, creek_long) %>% 
  nest(.key = 'sites') %>%
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/creek_site.json')

sites %>% 
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/sites.json')

# TWP site data ------
stationcode_to_label <- sites %>%
  select(creek_id, StationCode = site_id, label)
  
analytes <- read_excel('data-raw/WQ_data.xlsx', 'analytes')

units <- read_excel('data-raw/WQ_data.xlsx', 'units')

groups <- read_excel('data-raw/WQ_data.xlsx', 'groups')

# observations_raw <- read_excel('data-raw/WQ_data.xlsx', 'Observations')
# 
# observations_raw %>% 
#   select(StationCode, SampleDate, AnalyteName, UnitName, Result = VariableResult) %>% 
#   filter(Result != "Not Recorded") %>% 
#   group_by(StationCode, AnalyteName) %>% 
#   nest() %>% 
#   toJSON() %>% 
#   write_file('wq-app-gatsby/src/data/habitat_data.json')

bmi_raw <- read_excel('data-raw/BMI data.xlsx', sheet = 'BenthicResults') 

bmi <- bmi_raw %>% 
  group_by(SampleDate, StationCode) %>% 
  summarise(Result = round(sum((Count/sum(Count)) * `Tolerance Value`), 2)) %>% 
  ungroup() %>%  
  mutate(site_id = StationCode, AnalyteName = 'Benthic Macroinvertebrates', 
         category = 'Creek Bugs', UnitName = 'Tolerance', UnitDescription = 'weighted') %>% 
  left_join(sites) %>% 
  select(creek_id, StationCode, AnalyteName, UnitName, UnitDescription, 
         category, label, SampleDate, Result)

# prep bioswale data
bax_raw <- read_excel('data-raw/baxter_bioswale_data.xlsx', range = "F7:S25", col_names = FALSE)

bax <- bax_raw %>% 
  select(StationCode = ...1, SampleDate = ...4, FlowDirection = ...6, 
         AnalyteName = ...12, UnitName = ...13, Result = ...14) %>% 
  filter(!is.na(StationCode)) %>% 
  left_join(analytes) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  mutate(creek_id = 'BAX', label = 'Booker T. Anderson Community Center') %>% 
  select(creek_id, StationCode, AnalyteName, UnitName, UnitDescription, 
         category, label, SampleDate, Result, FlowDirection)

field_results_raw <- read_excel('data-raw/WQ_data.xlsx', 'Measurements')

field_results <- field_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result) %>% 
  mutate(AnalyteName = case_when(
    AnalyteName == "SpecificConductivity" ~ "Specific Conductivity",
    AnalyteName == "Oxygen, Dissolved" ~ "Dissolved Oxygen",
    AnalyteName == "Nitrate as NO3" ~ "Nitrate",
    AnalyteName == "OrthoPhosphate as P" ~ "Phosphate",
    TRUE ~ AnalyteName
  )) %>% 
  left_join(analytes) %>%
  left_join(stationcode_to_label) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  filter(!is.na(AnalyteName), !is.na(Result), Result >= 0, StationCode != 'BAX030') %>% 
  bind_rows(bax, bmi) 

field_results %>% 
  group_by(creek_id, StationCode, AnalyteName, UnitName, UnitDescription, category, label) %>% 
  nest() %>% 
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/field_data.json')


# TWP creek scores-----
score_lu <- 0:2
names(score_lu) <- c('Bad', 'Marginal', 'Good')

scores <- field_results %>% 
  filter(AnalyteName %in% c('Specific Conductivity', 'pH', 'Dissolved Oxygen', 'Temperature', 'Turbidity')) %>% 
  mutate(acceptable = case_when(
    AnalyteName == 'Specific Conductivity' & between(Result, 150, 500) ~ TRUE,
    AnalyteName == 'pH' & between(Result, 6.5, 9) ~ TRUE,
    AnalyteName == 'Dissolved Oxygen' & Result > 5 ~ TRUE,
    AnalyteName == 'Temperature' & Result < 24 ~ TRUE,
    AnalyteName == 'Turbidity' & Result < 10 ~ TRUE,
    TRUE ~ as.logical(FALSE)
  )) %>% 
  group_by(creek_id, AnalyteName) %>% 
  summarise(
    observations = n(), 
    num_stations = n_distinct(StationCode),
    obv_ratio = observations / num_stations,
    prop_acceptable = mean(acceptable), 
    score = case_when(
      obv_ratio > 5 & prop_acceptable >= .9 ~ 'Good',
      obv_ratio > 5 & prop_acceptable < .9 & prop_acceptable >= .5 ~ 'Marginal',
      obv_ratio > 5 & prop_acceptable < .5 ~ 'Bad',
      TRUE ~ as.character(NA)
    ),
    score_2 = score_lu[score],
    min_date = min(SampleDate), max_datae = max(SampleDate)) 

scores %>% 
  write_csv('wq-app-gatsby/src/data/creek_scores.csv')

# not using creek grades currently
scores %>% 
  group_by(creek_id) %>% 
  filter(!is.na(score)) %>% 
  summarise(total = sum(score_2, na.rm = TRUE), max = n()*2, grade = total/max * 100) %>% 
  mutate(letter_grade = case_when(
    between(grade, 97, 100) ~ 'A+',
    between(grade, 93, 97) ~ 'A',
    between(grade, 90, 93) ~ 'A-',
    between(grade, 87, 90) ~ 'B+',
    between(grade, 83, 87) ~ 'B',
    between(grade, 80, 83) ~ 'B-',
    between(grade, 77, 80) ~ 'C+',
    between(grade, 73, 77) ~ 'C',
    between(grade, 70, 73) ~ 'C-',
    between(grade, 67, 70) ~ 'D+',
    between(grade, 63, 67) ~ 'D',
    between(grade, 60, 63) ~ 'D-',
    grade < 60 ~ 'F'
  )) %>% 
  add_row(creek_id = 'BAX', total = NA, max = NA, grade = NA, letter_grade = NA) %>% 
  write_csv('wq-app-gatsby/src/data/creek_grades.csv')

# CEDEN site data -------
# see prep_ceden.R for protocol creation
protocol <- read_rds('data/CEDENProtocolLookUp.rds') %>% 
  select(-LastUpdateDate)

ceden <- read_delim('data-raw/ceden_data_retrieval_201911211371.txt', delim = '\t')

filtered_analytes <- read_csv('data-raw/ceden_analyte_filter.csv') %>% 
  select(-count, -group_name)

stations <- ceden %>% 
  filter(Program != 'The Watershed Project Water Quality Monitoring', 
         Analyte %in% filtered_analytes$Analyte, !is.na(Result)) %>% 
  group_by(StationCode, Analyte) %>% 
  summarise(count = n(), min = min(SampleDate), max = max(SampleDate)) %>% 
  filter(year(max) > 2013, count >= 4) %>%
  pull(StationCode) %>% 
  unique()

ceden %>% 
  filter(StationCode %in% stations, !is.na(Result),
         Program != 'The Watershed Project Water Quality Monitoring', 
         Analyte %in% filtered_analytes$Analyte) %>% 
  group_by(Program, StationName, StationCode, SampleDate, Analyte, Unit, 
           lat = TargetLatitude, long = TargetLongitude, ProtocolCode) %>% 
  summarise(Result = mean(Result)) %>% 
  left_join(protocol) %>% 
  left_join(filtered_analytes) %>% 
  group_by(Program, StationName, StationCode, lat, long, ProtocolCode, ProtocolName, 
           ProtocolDescr, Analyte, Unit, analyte_desc_name, analyte_desc_name_2) %>% 
  nest() %>% 
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/external_ceden.json')

# combine CEDEN site metadata with TWP site metadata ------
ceden_stations <- ceden %>% 
  filter(StationCode %in% stations, !is.na(Result),
         Program != 'The Watershed Project Water Quality Monitoring', 
         Analyte %in% filtered_analytes$Analyte) %>% 
  select(StationName, StationCode, lat = TargetLatitude, long = TargetLongitude) %>% 
  unique() 

ceden_stations <- ceden_stations %>% 
  mutate(site_id = StationCode, name = StationName, label = NA, description = NA,
         creek_id = NA, creek_name = NA, source = 'CEDEN') %>% 
  select(site_id, name, label, description, lat, long, creek_id, creek_name, source)

sites %>% 
  mutate(source = 'The Watershed Project') %>% 
  bind_rows(ceden_stations) %>% 
  write_csv('wq-app-gatsby/src/data/twpCedenSites.csv')

# prep images look up ---------
read_csv('data-raw/images.csv') %>% 
  write_csv('wq-app-gatsby/src/data/images.csv')

# prep water quality feature information ------
wq_categories <- read_csv('data-raw/wq_categories.csv') 

wq_features <- read_csv('data-raw/wq_features.csv')

wq_features %>% 
  left_join(wq_categories) %>% 
  group_by(category, description) %>% 
  nest(.key = "features") %>% 
  toJSON() %>% 
  write_file('wq-app-gatsby/src/data/wq_categories_features.json')

# prep thresholds ----
read_csv('data-raw/water_quality_thresholds.csv') %>% 
  write_csv('wq-app-gatsby/src/data/water_quality_thresholds.csv')

