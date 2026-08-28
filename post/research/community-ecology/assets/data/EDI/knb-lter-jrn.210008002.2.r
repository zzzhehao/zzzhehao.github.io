# Package ID: knb-lter-jrn.210008002.2 Cataloging System:https://pasta.edirepository.org.
# Data set title: Arthropod pitfall trap data from 9 NPP study locations at the Jornada Basin LTER site, 1988-1994.
# Data set creator:  David Lightfoot - Jornada Basin LTER (now at Univ. of NM) 
# Data set creator:  Walter Whitford - New Mexico State University 
# Contact:  John Anderson -  New Mexico State University  - 0000-0001-5060-9955
# Contact:  David Lightfoot -  Jornada Basin LTER (now at Univ. of NM)  - dlightfo@unm.edu
# Contact:   Data Manager -  Jornada Basin LTER  - datamanager.jrn.lter@gmail.com
# Stylesheet v2.11 for metadata conversion into program: John H. Porter, Univ. Virginia, jporter@virginia.edu 

inUrl1  <- "https://pasta.lternet.edu/package/data/eml/knb-lter-jrn/210008002/2/7e5c67ae8b4ff447a22aa2f331a4fa16" 
infile1 <- tempfile()
try(download.file(inUrl1,infile1,method="curl"))
if (is.na(file.size(infile1))) download.file(inUrl1,infile1,method="auto")

                   
 dt1 <-read.csv(infile1,header=F 
          ,skip=1
            ,sep=","  
        , col.names=c(
                    "date",     
                    "year",     
                    "month",     
                    "zone",     
                    "site",     
                    "plot",     
                    "order",     
                    "family",     
                    "genus",     
                    "species",     
                    "count",     
                    "error"    ), check.names=TRUE)
               
unlink(infile1)
		    
# Fix any interval or ratio columns mistakenly read in as nominal and nominal columns read as numeric or dates read as strings
                                                   
# attempting to convert dt1$date dateTime string to R date structure (date or POSIXct)                                
tmpDateFormat<-"%Y-%m-%d"
tmp1date<-as.Date(dt1$date,format=tmpDateFormat)
# Keep the new dates only if they all converted correctly
if(nrow(dt1[dt1$date != "",]) == length(tmp1date[!is.na(tmp1date)])){dt1$date <- tmp1date } else {print("Date conversion failed for dt1$date. Please inspect the data and do the date conversion yourself.")}                                                                    
                                
if (class(dt1$month)=="factor") dt1$month <-as.numeric(levels(dt1$month))[as.integer(dt1$month) ]               
if (class(dt1$month)=="character") dt1$month <-as.numeric(dt1$month)
if (class(dt1$zone)!="factor") dt1$zone<- as.factor(dt1$zone)
if (class(dt1$site)!="factor") dt1$site<- as.factor(dt1$site)
if (class(dt1$plot)!="factor") dt1$plot<- as.factor(dt1$plot)
if (class(dt1$order)!="factor") dt1$order<- as.factor(dt1$order)
if (class(dt1$family)!="factor") dt1$family<- as.factor(dt1$family)
if (class(dt1$genus)!="factor") dt1$genus<- as.factor(dt1$genus)
if (class(dt1$species)!="factor") dt1$species<- as.factor(dt1$species)
if (class(dt1$count)=="factor") dt1$count <-as.numeric(levels(dt1$count))[as.integer(dt1$count) ]               
if (class(dt1$count)=="character") dt1$count <-as.numeric(dt1$count)
if (class(dt1$error)!="factor") dt1$error<- as.factor(dt1$error)
                
# Convert Missing Values to NA for non-dates
                


# Here is the structure of the input data frame:
str(dt1)                            
attach(dt1)                            
# The analyses below are basic descriptions of the variables. After testing, they should be replaced.                 

summary(date)
summary(year)
summary(month)
summary(zone)
summary(site)
summary(plot)
summary(order)
summary(family)
summary(genus)
summary(species)
summary(count)
summary(error) 
                # Get more details on character variables
                 
summary(as.factor(dt1$zone)) 
summary(as.factor(dt1$site)) 
summary(as.factor(dt1$plot)) 
summary(as.factor(dt1$order)) 
summary(as.factor(dt1$family)) 
summary(as.factor(dt1$genus)) 
summary(as.factor(dt1$species)) 
summary(as.factor(dt1$error))
detach(dt1)               
        
zhehaoTools::saveObjRDS("dt1", "biology-research/community-ecology/assets/data", "jornada.8894")




