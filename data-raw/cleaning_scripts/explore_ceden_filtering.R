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

# manually reviewed above and selected subset to make 'data-raw/ceden_analyte_filter.csv'
