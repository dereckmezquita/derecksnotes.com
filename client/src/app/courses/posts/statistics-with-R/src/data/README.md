# Data sources

## Dataset Description: Moscow, Russia Climate Data

- 3878388.csv: moscow, russia climate data: https://www.ncdc.noaa.gov/cdo-web/search
    ```
    Status	Complete
    Date Submitted	2024-12-18
    Product	GHCND (CSV)
    Order Details	
    Processing Completed	2024-12-18
    Locations	
    CITY:RS000038
    Begin Date	1936-12-31 00:00
    End Date	2022-01-15 23:59
    Data Types	
    PRCP SNWD TAVG TMAX TMIN
    Units	
    Metric
    Custom Flag(s)	
    Station Name Geographic Location Include Data Flags
    Eligible for Certification	No
    ```

Data Source: NOAA NCDC GHCN-Daily Data
Location: Moscow, Russia (Station ID: RSM00027612)
Time Range: 1936-12-31 to 2022-01-15
Units: Metric (temperature in °C, precipitation in mm)
Data Types: PRCP (Precipitation), SNWD (Snow Depth), TAVG (Average Daily Temperature), TMAX (Daily Maximum Temperature), TMIN (Daily Minimum Temperature)

This dataset contains daily meteorological observations collected from a weather station in Moscow, Russia. The data are derived from NOAA’s Global Historical Climatology Network - Daily (GHCN-D).

Columns
1. STATION
    - Type: Character
    - Description: Unique station identifier assigned by the weather service or NOAA. For this dataset, the station ID is typically something like RSM00027612.
2. NAME
    - Type: Character
    - Description: Human-readable station name and location, e.g. MOSCOW, RS. This gives you a descriptive label for the station’s geographical area.
3. LATITUDE
    - Type: Numeric
    - Units: Decimal degrees
    - Description: The geographic latitude of the station. Positive values are north of the equator. For Moscow, approximately 55.8331.
4. LONGITUDE
    - Type: Numeric
    - Units: Decimal degrees
    - Description: The geographic longitude of the station. Positive values are east of the Prime Meridian. For Moscow, approximately 37.6167.
5. ELEVATION
    - Type: Numeric
    - Units: Metres above mean sea level (m)
    - Description: The elevation of the station. For Moscow, 156.0 m above sea level.
6. DATE
    - Type: Date (YYYY-MM-DD)
    - Description: The date for the daily observation. Each row corresponds to a single day’s measurements.
7. PRCP
    - Type: Numeric (may be NA if no data)
    - Units: Millimetres (mm)
    - Description: Daily total precipitation (rain, melted snow, etc.). Missing values are recorded as NA.
8. PRCP_ATTRIBUTES
    - Type: Character (flag codes)
    - Description: These are data quality and origin flags associated with the precipitation measurement. They often appear as codes separated by commas (e.g., B,,S). Each code represents a particular quality check, data source, or adjustment made to the raw data. For detailed meanings, refer to the GHCN-D documentation provided by NOAA.
9. SNWD
    - Type: Numeric (may be NA if no data)
    - Units: Millimetres (mm)
    - Description: Daily snow depth measurement. Missing values are recorded as NA.
10. SNWD_ATTRIBUTES
    - Type: Character (flag codes)
    - Description: Similar to PRCP_ATTRIBUTES, this column contains quality and source flags for the snow depth data. Multiple flags separated by commas indicate different checks or data processing steps.
11. TAVG
    - Type: Numeric (may be NA if no data)
    - Units: Degrees Celsius (°C)
    - Description: The daily average temperature. When present, it represents the mean of measured temperatures over the day. Missing values are recorded as NA.
12. TAVG_ATTRIBUTES
    - Type: Character (flag codes)
    - Description: Quality, source, and processing flags for the average temperature measurement. Comma-separated codes (e.g., H,,S) denote various data quality checks, interpolation methods, or flags indicating source reliability as defined by NOAA’s GHCN-D documentation.
13. TMAX
    - Type: Numeric (may be NA if no data)
    - Units: Degrees Celsius (°C)
    - Description: The maximum temperature observed during the day. Missing values are recorded as NA.
14. TMAX_ATTRIBUTES
    - Type: Character (flag codes)
    - Description: Flags for the maximum temperature data. Multiple commas separate different attribute fields or codes that detail data quality or source.
15. TMIN
    - Type: Numeric (may be NA if no data)
    - Units: Degrees Celsius (°C)
    - Description: The minimum temperature observed during the day. Missing values are recorded as NA.
16. TMIN_ATTRIBUTES
    - Type: Character (flag codes)
    - Description: Flags for the minimum temperature data, similar to TMAX_ATTRIBUTES and TAVG_ATTRIBUTES.

About the Attribute Columns

The attribute columns (e.g., PRCP_ATTRIBUTES, SNWD_ATTRIBUTES, TAVG_ATTRIBUTES, TMAX_ATTRIBUTES, TMIN_ATTRIBUTES) contain data quality and source flags provided by GHCN-D. These strings may include multiple commas. Each position separated by a comma represents a specific type of flag or a quality control code. Not all positions may be used, resulting in empty strings between commas.

For example, a value like H,,S might mean:
    - H = The data passed a particular quality check or was derived from a certain high-quality source.
    - , = A placeholder indicating no code for this position.
    - S = Another code indicating a secondary check or source type.

The exact meaning of each flag can be found in NOAA’s GHCN-D documentation, which provides a legend for all possible codes.
