// Alexis Perumal, 4/4/20
// Use plotly to build a timeseries chart comparing different areas.

// console.log('In logic-timeseries.js');

// US State time series data from NY Times:
//   https://github.com/nytimes/covid-19-data/blob/master/us-states.csv
        // Schema Example:
        // {date: "2020-01-21", state: "Washington", fips: "53", cases: "1", deaths: "0"}
        //     date: "2020-01-21"
        //     state: "Washington"
        //     fips: "53"
        //     cases: "1"
        //     deaths: "0"
// usStatesURL_JSON = "";
usStatesURL_CSV = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";

// US County data time series data from NY Times:
//   https://github.com/nytimes/covid-19-data/blob/master/us-counties.csv
        // Schema Example:
        // {date: "2020-01-21", county: "Snohomish", state: "Washington", fips: "53061", cases: "1", …}
        //     date: "2020-01-21"
        //     county: "Snohomish"
        //     state: "Washington"
        //     fips: "53061"
        //     cases: "1"
        //     deaths: "0"
usCountiesURL_JSON = "nyt_covid-19_us/us-counties.json";
usCountiesURL_CSV = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";


function init() {
    var chart_div_selector = document.getElementById('us_timeseries');

    // Read in the csv into javascript, http://learnjsdata.com/read_data.html
    d3.csv(usStatesURL_CSV).then((data) => {   
        buildStateTimeSeriesChart(chart_div_selector, data);
        } );
}


function buildStateTimeSeriesChart_old(selector, state_data) {
    var data_NY = state_data.filter(record => record.state == "New York");
    var x_values_NY = data_NY.map(function(value) { return value.date; });
    var y_cases_NY = data_NY.map(function(value) { return value.cases; });
    var y_deaths_NY = data_NY.map(function(value) { return value.deaths; });

    var data_CA = state_data.filter(record => record.state == "California");
    var x_values_CA = data_CA.map(function(value) { return value.date; });
    var y_cases_CA = data_CA.map(function(value) { return value.cases; });
    var y_deaths_CA = data_CA.map(function(value) { return value.deaths; });


    // TESTER = document.getElementById('tester');
    // Plotly.newPlot(TESTER, [{
    //     x: [1, 2, 3, 4, 5],
    //     y: [1, 2, 4, 8, 16] }], {
    //     margin: { t: 0 } }
    // );

    let NY_Cases = {
        x: x_values_NY,
        y: y_cases_NY,
        text: "NY Cases",
        mode: 'lines'
    };

    let NY_Deaths = {
        x: x_values_NY,
        y: y_deaths_NY,
        text: "NY Deaths",
        mode: 'lines'
    };

    let CA_Cases = {
        x: x_values_CA,
        y: y_cases_CA,
        text: "CA Cases",
        mode: 'lines'
    };

    let CA_Deaths = {
        x: x_values_CA,
        y: y_deaths_CA,
        text: "CA Deaths",
        mode: 'lines'
    };

    let timeseries_data = [NY_Cases, NY_Deaths, CA_Cases, CA_Deaths];

    var timeseries_layout = {
        title: 'New York and California Cases and Deaths'
      };

    Plotly.newPlot("us_timeseries", timeseries_data, timeseries_layout);

}

function buildStateTimeSeriesChart(selector, dataset) {
    var states = ['New York', 'New Jersey', 'Washington', 'California', 'Michigan']

    let cases_traces = [];
    let deaths_traces = [];
    let state_data = [];
    let trace = {};
    for (i=0; i<states.length; i++) {
        state_data = dataset.filter(record => ((record.state == states[i]) &&
                                    (Date.parse(record.date) >= Date.parse("2020-03-15"))));
        x_values = state_data.map(function(value) { return value.date; });
        y_cases = state_data.map(function(value) { return value.cases; });
        y_deaths = state_data.map(function(value) { return value.deaths; });

        cases_trace = {
            x: x_values,
            y: y_cases,
            name: `${states[i]} Cases`,
            mode: 'lines'
        };
        cases_traces.push(cases_trace);

        deaths_trace = {
            x: x_values,
            y: y_deaths,
            name: `${states[i]} Deaths`,
            mode: 'lines'
        };
        deaths_traces.push(deaths_trace);
    };

    var cases_layout = {
        title: 'COVID-19 Cases by select US States',
        // yaxis : {
        //     type : 'log',
        //     autorange : true
        //   }
      };

    Plotly.newPlot("us_timeseries_cases", cases_traces, cases_layout);

    var deaths_layout = {
        title: 'COVID-19 Deaths by select US States',
        // yaxis : {
        //     type : 'log',
        //     autorange : true
        //   }
      };

    Plotly.newPlot("us_timeseries_deaths", deaths_traces, deaths_layout);
}


function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
}

// Initialize the dashboard
init();
