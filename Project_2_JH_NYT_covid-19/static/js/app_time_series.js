
/* ---------------------------------------------- */
/* helper functions */
/* ---------------------------------------------- */
function renameProperty(obj) {
  let newObject = {};
  Object.entries(obj).forEach(([key, value])=>{
    newObject[key.split("/").join("_")] = value
    })

    return newObject;
}

function convertToTable(data){
  let csv = '';
  let header = Object.keys(data).join(',');
  let values = Object.values(data).map(item => Object.values(item));
  
  csv += header + '\n' + values;
//  console.log(csv)
 // console.log(d3.csvParse(csv));
 return d3.csvParse(csv);

}

function convertValuesToArray(obj){
  return Object.entries(obj).map(([key,value]) => value)
}

function convertArrayObjects(obj){
  var arr = Object.keys(obj).map(function (key) {
    return { [key]: obj[key] };
  });
  
 // console.log(result);
  return arr;
}

function keyValuePairArr(arrObj){
 // console.log(arrObj)
  let arrNewObj = [];
  
  for(let i = 0; i < arrObj.length; i++){
     let newObj = {}
    // console.log(arrObj[i]);
    // console.log(Object.keys(arrObj[i])[0]);
     newObj['date'] = Object.keys(arrObj[i])[0];
     newObj['countConfirmed'] = +Object.values(arrObj[i])[0]
     arrNewObj.push(newObj)
  }
   // console.log(arrNewObj);
    return arrNewObj
}

// assumption is both arrays are of equal length and has the share the same key
function addKeyObjArr(arrObjConfirmed, arrObjDeath){
   let arrNewObj = [];
   
   for(let i = 0; i < arrObjConfirmed.length; i++){
      let newObj = {}
      newObj['date'] = Object.keys(arrObjConfirmed[i])[0];
      newObj['countConfirmed'] = +Object.values(arrObjConfirmed[i])[0];
      newObj['countDeath'] = +Object.values(arrObjDeath[i])[0];
      arrNewObj.push(newObj)
   }
     //console.log(arrNewObj);
     return arrNewObj
 }

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

// the list can be changed as required
const arrayKeysRemoved = ['Province_State', 'Country_Region', 'Lat', 'Long']

function removeProperties(obj,arrayKeysRemoved ){
  var result = _.omit(obj, arrayKeysRemoved);
  //console.log(result);
  return result;
}
/* ---------------------------------------------- */
/* helper functions */
/* ---------------------------------------------- */

/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */

function updatesTimeSeries(){

  const urlTimeSeries = "csse_covid_19_time_series/time_series_covid19_confirmed_global.json";
  d3.json(urlTimeSeries).then(timeSeriesData => {
  var usData = multiFilter(timeSeriesData,filters)
  var newObject = renameProperty(usData[0])
   // to remove the first few unwanted keys
  let { Province_State, Country_Region, Lat, Long, ...dates } = newObject;
  //console.log(dates);

  var arrDates = convertArrayObjects(dates);
  //console.log(arrDates)

  var arrDatesCount = keyValuePairArr(arrDates);
  //console.log(arrDatesCount);
  
 const ticksDate = arrDatesCount.slice(Math.max(arrDatesCount.length - 10, 0))

  barChart(ticksDate);

}).catch(err => console.log(err));  
}

//updatesTimeSeries()

const filters = {
  "Country/Region": "US"
};


function getDataTimeSeries(){
Promise.all([
    d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
    d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
]).then(([confirmed, deaths]) =>  {
  console.log(confirmed)
  var confirmedData = multiFilter(confirmed,filters);
  var deathData = multiFilter(deaths,filters);
 
  // renaming the properties that has '/' to '_', this step can be excluded if the naming convension is followed
  var newConfirmedObject = renameProperty(confirmedData[0])
  var  newDeathObject= renameProperty(deathData[0])

  // to remove the first few unwanted keys not required for the plot
  const { Province_State, Country_Region, Lat, Long, ...datesConfirmed } = newConfirmedObject;
  //console.log(datesConfirmed)

  var datesDeaths = removeProperties(newDeathObject,arrayKeysRemoved );
  //console.log(datesDeaths)

   // convert key value pair to array of objects,format required for plotting
  var arrDatesConfirmed= convertArrayObjects(datesConfirmed);
  //console.log(arrDatesConfirmed)
  var arrDatesDeath = convertArrayObjects(datesDeaths);
  //console.log(arrDatesDeath)

  var arrDatesConfirmedDeathCount = addKeyObjArr(arrDatesConfirmed,arrDatesDeath);
  //console.log(arrDatesConfirmedDeathCount)

  const ticksDate = arrDatesConfirmedDeathCount.slice(Math.max(arrDatesConfirmedDeathCount.length - 10, 0))

  barStackedChart(ticksDate)
  
}).catch(function(err) {
    console.log(err)
})
}

getDataTimeSeries();

/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */


/* ---------------------------------------------- */
/* charts */
/* ---------------------------------------------- */


/* create a bar chart horizontal */
function barChart(data){

//console.log(d3.max(data, d => d.countConfirmed))

  // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 90, left: 40},
width = 600 - margin.left - margin.right,
height = 350 - margin.top - margin.bottom;
padding = 100; // space around the chart, not including labels

// append the svg object to the body of the page
var svg = d3.select("#barChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // X axis
var x = d3.scaleBand()
.range([ 0, width ])
.domain(data.map(function(d) { return d.date; }))
.padding(0.2);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.countConfirmed)])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

  // now add titles to the axes
  svg.append("g").append("text")
  .attr("text-anchor", "middle") 
  .attr("class", "axis-text") // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate("+ (padding/4) +","+(height/4)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
  .text("confirmed cases");

  svg.append("g").append("text")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate("+ (width/2) +","+(height+(padding/1.5))+")")  // centre below axis
  .text("Date");
 

// Bars
var cirfirmedGroup = svg.selectAll("mybar")
.data(data)
.enter()
.append("rect")
.attr("x", function(d) { return x(d.date); })
.attr("width", x.bandwidth())
.attr("fill", "#8C2A2A")
// no bar at the beginning thus:
.attr("height", function(d) { return height - y(0); }) // always equal to 0
.attr("y", function(d) { return y(0); })

  // Animation
svg.selectAll("rect")
.transition()
.duration(800)
.delay(800)
.attr("y", function(d) { return y(d.countConfirmed); })
.attr("height", function(d) { return height - y(d.countConfirmed); })
.delay(function(d,i){console.log(i) ; return(i*100)})

}

function barStackedChart(data){
   // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // List of subgroups = header of the csv files = soil condition here
  var subgroups = Object.keys(data[0]).slice(1)

  console.log(subgroups)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.date)}).keys()

  //console.log(groups)

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

    var minyAxisValue = d3.min(data, d=> d.countConfirmed);
    console.log(minyAxisValue)

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.countConfirmed)])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#40291C','#88C1F2'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

   console.log(stackedData)

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#barChart")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "#bfae9f")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
  

  // Show the bars
  var barGroup = svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { 
        return color(d.key); })
      .selectAll("rect")
            .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { 
         // console.log(d.data);
          return x(d.data.date); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());


     barGroup.on("mouseover", function(d) {
        // console.log(this.parentNode);
         var subgroupName = d3.select(this.parentNode).datum().key;
        // console.log(subgroupName);
         var subgroupValue = d.data[subgroupName];
         //console.log(subgroupValue);
         tooltip.style("display", "block")
             .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
             .style("opacity", 1)
             .style("left", d3.select(this).attr("x") + "px")
             .style("top", d3.select(this).attr("y") + "px");

       })
      .on("mouseout", function(d) {
        toolTip.style("display", "none");
      })

 }

/* ---------------------------------------------- */
/* charts */
/* ---------------------------------------------- */