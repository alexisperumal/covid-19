// Alexis Perumal, 4/4/20
// Use plotly to build a timeseries chart comparing different areas.

usCountyURL = "nyt_covid-19_us/us-counties.json";
usCountyCSVURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

console.log('In logic-timeseries.js');


function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach( entry => PANEL.append('p').text(`${entry[0]}: ${entry[1]}`));

        // BONUS: Build the Gauge Chart
        // Spedometer type gauge
        var gauge_data = [ {
            domain: {x: [0,1], y:[0,1]},
            gauge: {
                axis: {range: [0, 10]}
            },
            value: result.wfreq,
            title: { text: `Subject #${sample}: BB Scrubs per Week`},
            type: "indicator",
            mode: "gauge+number"
            } ];
        let gauge_layout = { width: 600, height: 500, margin: {t:0, b:0}};
        Plotly.newPlot('gauge', gauge_data, gauge_layout);

    });
}



function buildCharts(sample) {
    // console.log(`sample: ${sample}`)
    d3.json("./data/samples.json").then((data) => {


        // // 1. Create the main horizontal bar chart.
        var samples = data.samples; // samples is the array of results on all samples.
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0]; // result has all the data for the specified sample.
                                     // This includes: otu_ids, sample_values, otu_labels
                                     
        // console.log('samples: ', samples);
        // console.log('result: ', result);

        // // Todo: Instead of just grabbing the first 10, get those
        // // with the highest frequency in the population.
        // let otu_array = result.otu_ids.slice(0,10).map(item => `OTU  ${item}`).reverse();
        // let otu_labels = result.otu_labels.slice(0,10).reverse();
        // let otu_values = result.sample_values.slice(0,10).reverse();

        // var hbar_chart_data = [{
        //     type:'bar',
        //     x: otu_values,
        //     y: otu_array,
        //     text: otu_labels,
        //     orientation: 'h'
        // }]

        // var hbar_chart_layout = {
        //   title: `Most occuring OTU in subject #${sample}`
        // };
    
        // Plotly.newPlot("bar", hbar_chart_data, hbar_chart_layout);




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
    // d3.json("samples2.json").then((data) => {
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
    // buildMetadata(newSample);
}

// Initialize the dashboard
init();