// Alexis Perumal, 4/4/20
// Use plotly to build a timeseries chart comparing different areas.

usCountyURL = "nyt_covid-19_us/us-counties.json";
usCountyCSVURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

console.log('In logic-timeseries.js');


usCountiesURL = "nyt_covid-19_us/us-counties.json";


d3.csv(usCountiesURL).then((data) => {
    // var sampleNames = data.names;

    // sampleNames.forEach((sample) => {
    //     selector
    //         .append("option")
    //         .text(sample)
    //         .property("value", sample);
    // }
    
    console.log('In getData(usCountiesURL) promise function.');

    console.log(data);

    dummy_function();
    
    } );


function dummy_function() {
    console.log("Hi, from dummy_function.")
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

function init() {
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

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
}

// Initialize the dashboard
init();