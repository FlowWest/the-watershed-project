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
  left_join(creeks_to_stations) %>% 
  select(-Name) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  filter(!is.na(AnalyteName), !is.na(Result), Result >= 0) %>% 
  group_by(creek_id, StationCode, AnalyteName, UnitName, UnitDescription, category) %>% 
  nest() %>% 
  toJSON() #%>% 
# write_json('wq-app-gatsby/src/data/field_data.json')

field_results <- field_results_raw %>% 
  select(StationCode, SampleDate, AnalyteName, UnitName, Result) %>% 
  left_join(analytes) %>% 
  left_join(creeks_to_stations) %>% 
  mutate(AnalyteName = Name) %>% 
  select(-Name) %>% 
  left_join(units) %>% 
  left_join(groups) %>% 
  filter(!is.na(AnalyteName), !is.na(Result))

field_results %>% 
  group_by(StationCode, AnalyteName) %>% 
  summarise(count= n()) %>% 
  spread(AnalyteName, count) %>% View

unique(field_results$AnalyteName)

# thresholds
field_results %>% 
  filter(AnalyteName == 'Specific Conductivity') %>% 
  mutate(yup = between(Result, 150, 500)) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'pH') %>% 
  mutate(yup = between(Result, 6.5, 9)) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Dissolved Oxygen') %>% 
  mutate(yup = Result > 5) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Turbidity') %>% 
  mutate(yup = Result < 10) %>%
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Nitrate') %>% 
  mutate(yup = Result < .5) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Copper') %>% 
  mutate(yup = Result < 13) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Lead') %>% 
  mutate(yup = Result < 65) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Mercury') %>% 
  mutate(yup = between(Result, .77, 1.4)) %>% 
  summarise(mean(yup))

field_results %>% 
  filter(AnalyteName == 'Diesel Fuel') 

field_results %>% 
  group_by(creek_id, StationCode, AnalyteName) %>% 
  summarise(count = n()) %>% 
  spread(AnalyteName, count) %>% View
filter(AnalyteName == 'pH') %>% 
  mutate(yup = between(Result, 6.5, 9)) %>% 
  summarise(mean(yup))


# score-----
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

scores %>% View
  write_csv('wq-app-gatsby/src/data/creek_scores.csv')


# library(rvest)
# grade_scale <- read_html("http://ixd.ucsd.edu/home/f16/grading-scale.html") %>% 
#   html_table(header = TRUE) %>% 
#   flatten_df()
# 
# write_rds(grade_scale, 'data-raw/grade_scale.rds')
# grade_scale <- read_rds('data-raw/grade_scale.rds')
# grade_scale

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