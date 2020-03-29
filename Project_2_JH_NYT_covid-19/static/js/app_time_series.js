
function updatesTimeSeries(){

    const urlTimeSeries = "csse_covid_19_time_series/time_series_covid19_confirmed_global.json";
    d3.json(urlTimeSeries).then(timeSeriesData => {
   // console.log(timeSeriesData)
  
    console.log(multiFilter(timeSeriesData,filters));
          
}).catch(err => console.log(err));  
}

updatesTimeSeries()

const multiFilter = (arr, filters) => {
  const filterKeys = Object.keys(filters);
  return arr.filter(eachObj => {
    return filterKeys.every(eachKey => {
      if (!filters[eachKey].length) {
        return true; // passing an empty filter means that filter is ignored.
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
};

const filters = {
  "Country/Region": "US"
};