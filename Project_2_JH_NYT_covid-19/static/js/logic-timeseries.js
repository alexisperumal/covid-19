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


function buildStateTimeSeriesChart(selector, state_data) {
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


function buildCharts(sample) {
    // console.log(`sample: ${sample}`)
    d3.json("./data/samples.json").then((data) => {

        var samples = data.samples; // samples is the array of results on all samples.
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0]; // result has all the data for the specified sample.
                                     // This includes: otu_ids, sample_values, otu_labels
                                     

        // 2. Create the scatter plot

        // console.log('result: ', result)
        // console.log('result.otu_ids', result.otu_ids);
        // console.log('result.sample_values', result.sample_values);

        let trace1 = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            type: 'scatter',
            text: result.otu_ids.map(id => `OTU #${id}`),
            marker: {
                color: result.otu_ids,
                colorscale: 'Earth',
                showscale: true,
                size: result.sample_values.map(v => parseFloat(v)*0.75)
            }
        };

        let bubble_data = [trace1];

        var bubble_chart_layout = {
            title: `OTU Prevelance in subject #${sample}`
          };

        Plotly.newPlot("us_timeseries", bubble_data, bubble_chart_layout);

    });
}



function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
}






/////////////

function pseudo_init(){
d3.csv(usCountyCSVURL).then((data) => {
    // var sampleNames = data.names;

    // sampleNames.forEach((sample) => {
    //     selector
    //         .append("option")
    //         .text(sample)
    //         .property("value", sample);
    // }
    
    console.log('In getData(usCountiesURL) promise function.');

    console.log(data);

    // dummy_function();
    
    } );
}


function dummy_function() {
    console.log("Hi, from dummy_function.")
}

/////////////////



// Initialize the dashboard
init();







///////////////////////////////////

// Starter code from Plotly OTU HW Assignment - START

function buildCharts_original(sample) {
    // console.log(`sample: ${sample}`)
    d3.json("./data/samples.json").then((data) => {

        var samples = data.samples; // samples is the array of results on all samples.
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0]; // result has all the data for the specified sample.
                                     // This includes: otu_ids, sample_values, otu_labels
                                     

        // 2. Create the scatter plot

        // console.log('result: ', result)
        // console.log('result.otu_ids', result.otu_ids);
        // console.log('result.sample_values', result.sample_values);

        let trace1 = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            type: 'scatter',
            text: result.otu_ids.map(id => `OTU #${id}`),
            marker: {
                color: result.otu_ids,
                colorscale: 'Earth',
                showscale: true,
                size: result.sample_values.map(v => parseFloat(v)*0.75)
            }
        };

        let bubble_data = [trace1];

        var bubble_chart_layout = {
            title: `OTU Prevelance in subject #${sample}`
          };

        Plotly.newPlot("us_timeseries", bubble_data, bubble_chart_layout);

    });
}

function init_original() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    console.log("About to pull the data/samples.json data.")
    d3.json("./data/samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        // buildMetadata(firstSample);
    });
}

function optionChanged_original(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
}

// Starter code from Plotly OTU HW Assignment - FINISH