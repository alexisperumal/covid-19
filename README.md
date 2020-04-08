# covid-19-Project2
UCSD Data Science Project 2 - D3 Visualization - COVID-19 Dashboard

![Corona Website Demo](Presentation/2020-04-08_Corona_flask_website_demo-480.gif)

## Team Members:
* Alexis Perumal 
* Arundhati Chakraborty
* Grant Thompson

## Description

Interactive Data Visualization with various js visualization libraries, Python, and MongoDB to display the covid-19 cases around the globe and in United States

 ### The Dataset includes:

 * Time Series Data From John Hopkins
   * confirmed cases, death, recovered globally
   * confirmed and deaths in United States
 
 * states and County data for united states from New York Times

  Source: https://github.com/CSSEGISandData/COVID-19, https://github.com/nytimes/covid-19-data
 
### Libraries:

 * D3, Leaflet, Plotly, DC charts, google Charts (visualization)
 * Axios (library to call Promises in js), Lodash (helper functions)
 * pymongo to interacting with MongoDB (Notebook)
 * Flask to build the server, for routing
 * utility files in python to grab csv and convert to json before pushing it to database

### Dependencies:
 * MongoDB, PyMongo, Flask

 ### instructions to run the app:

 * cd Project_2_covid-19-pymongo-flask-app
 * run: app_pymongo_counties_states_US.ipynb and app_pymongo_time_series.ipynb which pushes teh data to cretaed database
 * python app.py -> to run server using flask connecting to the Frontend Visualization
 * put your own mapbox api key in config.js to view the leaflet geomap
 
 ### link to view the static version of the site:
 https://alexisperumal.github.io/covid-19/
 


