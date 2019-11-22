library(tidyverse)
library(lubridate)
library(jsonlite)
library(stringr)

# bring in protocol codes
# library(rvest)
# 
# protocol <- read_html("http://ceden.org/CEDEN_Checker/Checker/DisplayCEDENLookUp.php?List=ProtocolLookUp") %>%
#   html_table() %>%
#   flatten_df()
# 
# glimpse(protocol)
# names(protocol) <- c('ProtocolCode', 'ProtocolName', 'ProtocolDescr', 'LastUpdateDate')
# write_rds(protocol, 'data/CEDENProtocolLookUp.rds')

protocol <- read_rds('data/CEDENProtocolLookUp.rds') %>% 
  select(-LastUpdateDate)

ceden <- read_delim('data-raw/ceden_data_retrieval_201911211371.txt', delim = '\t')
glimpse(ceden)

wq_features <- read_csv('data-raw/wq_features.csv') %>% 
  rename(feature_description = description)
wq_features$name

# used this to narrow analytes of interest
ceden_filtered <- ceden %>% 
  filter(year(SampleDate) > 2009, Program != 'The Watershed Project Water Quality Monitoring') %>% 
  filter(str_detect(Analyte, '(?i)oxygen') | 
           str_detect(Analyte, 'pH') |
           str_detect(Analyte, '(?i)conductivity') |
           str_detect(Analyte, '(?i)temperature') |
           str_detect(Analyte, '(?i)turbidity') |
           str_detect(Analyte, '(?i)suspended') |
           str_detect(Analyte, '(?i)nitrate') |
           str_detect(Analyte, '(?i)nitrite') |
           str_detect(Analyte, '(?i)ammonium') |
           str_detect(Analyte, '(?i)phosphates') |
           str_detect(Analyte, '(?i)phosphorus') |
           str_detect(Analyte, '(?i)total organic carbon') |
           str_detect(Analyte, '(?i)fecal') |
           str_detect(Analyte, '(?i)hardness') |
           str_detect(Analyte, '(?i)copper') |
           str_detect(Analyte, '(?i)mercury') |
           str_detect(Analyte, '(?i)methylmercury') |
           str_detect(Analyte, '(?i)selenium') |
           str_detect(Analyte, '(?i)carbaryl') |
           str_detect(Analyte, '(?i)fipronil') |
           str_detect(Analyte, '(?i)detergent') |
           str_detect(Analyte, '(?i)pcb') |
           str_detect(Analyte, '(?i)pah') |
           str_detect(Analyte, '(?i)pbde') |
           str_detect(Analyte, '(?i)diesel') |
           str_detect(Analyte, '(?i)motor') |
           str_detect(Analyte, '(?i)grease') |
           str_detect(Analyte, '(?i)gasonline') |
           str_detect(Analyte, '(?i)trash') |
           str_detect(Analyte, '(?i)invertebrates') 
  ) 

ceden_filtered %>% 
  group_by(Analyte) %>% 
  summarise(count = n()) %>% 
  arrange(Analyte) %>% View
  # write_csv('analyte_count.csv')

# manually reviewed above and selected subset
filtered_analytes <- read_csv('data-raw/ceden_analyte_filter.csv') %>% 
  select(-count, -group_name)

stations <- ceden %>% 
  filter(Program != 'The Watershed Project Water Quality Monitoring', 
         Analyte %in% filtered_analytes$Analyte, !is.na(Result)) %>% 
  group_by(StationCode, Analyte) %>% 
  summarise(count = n(), min = min(SampleDate), max = max(SampleDate)) %>% 
  filter(year(max) > 2013, count >= 4) %>%
  pull(StationCode) %>% unique

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


ceden %>% 
  filter(StationCode %in% stations, !is.na(Result),
         Program != 'The Watershed Project Water Quality Monitoring', 
         Analyte %in% filtered_analytes$Analyte) %>% 
  select(StationName, StationCode, lat = TargetLatitude, long = TargetLongitude) %>% 
  unique() %>% 
  write_rds('data/ceden_stations.rds')
