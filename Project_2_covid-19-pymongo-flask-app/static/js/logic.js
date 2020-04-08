
function createMap(cases, deaths) {

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-basic",
        accessToken: API_KEY,
        //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY,
        //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY,
        //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    });


    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap,
        "Outdoor Map": outdoors,
    };

    var overlayMaps = {
        "Confirmed Cases": cases,
        "Deaths": deaths
    };


    var map = L.map("us_div", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [lightmap, cases]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collaped: false
    }).addTo(map);

    /*
   

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0,1,2,3,4,5,6,7,8];
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
        return div;
    };

    legend.addTo(map);
*/
};

function createMarkers(states) {
    //console.log(states);

    var casesMarker = [];
    var deathsMarker = [];
    states.forEach(function(state) {
        //console.log(state.location)
      
        casesMarker.push(
            L.circle(state.location, {
                fillOpacity: 0.5,
                weight:0,
                color: "red",
                fillColor: "red",
                radius: markerSize(state.cases),
        }).bindPopup("<h4>" + state.county + ", " + state.state + "</h4><hr><p>There are <b>" + state.cases + "</b> known cases of people who have or have had COVID-19. Thus far, <b>"+state.deaths+" people have died.</b> Last update: "+state.date+".</p>")
      );

      deathsMarker.push(
        L.circle(state.location, {
            fillOpacity: 0.5,
            weight:0,
            color: "gray",
            fillColor: "gray",
            radius: (markerSize(state.deaths)*5),
            })
        );
    });

    var cases = L.layerGroup(casesMarker);
    var deaths = L.layerGroup(deathsMarker);
    createMap(cases,deaths);
};

//convert fips to lat/lng approimxations for markers
function convertLatLng(latestData) {
    
    //link to FIPS lookup table 
    //var FipsURL = "lookup_tables/UID_ISO_FIPS_LookUp_Table.csv"
    var FipsURL = "/lookup_db/lookup_data"
    
    d3.json(FipsURL).then(function(fipsData){
        fipsData.forEach(function(d) {
            d.FIPS = +d.FIPS;
            d.Lat = +d.Lat;
            d.Long_ = +d.Long_;
        });
        
        latestData.forEach(function(data) {
            var result = fipsData.filter(function(fip){
                return fip.FIPS === data.fips;
            });
            
            Lat = (result[0] !== undefined) ? result[0].Lat : null;
            Lng = (result[0] !== undefined) ? (result[0].Long_) : null;
            data.location=[Lat, Lng];
            
            
            return latestData;
        });
        createMarkers(latestData);
    });
    //console.log(latestData);
    //createMarkers(latestData);
};

function latestData(data) {
    //Get last date in dataset 
    lastDate = data[(data.length)-1].date

    todaysData = [];

    //filter data to include only the latest information
    data.forEach(d => {
        if (d.date === lastDate)
        todaysData.push(d);
    });
    //console.log(todaysData)

    convertLatLng(todaysData);
};

function getData(url) {
    d3.json(url).then(function(jsonData) {
        //console.log(jsonData);
        
       
        // console.log(dates);
        
        jsonData.forEach(function(data) {
            data.fips = +data.fips;
            data.cases = +data.cases;
            data.deaths = +data.deaths;
            data.state = data.state;
            data.date = data.date;

            if (data.county === "New York City") {
                data.fips = 36061;
            };
        });
        

        latestData(jsonData);
    });
};

function markerSize(cases) {
    
    return cases*15;
};

usStateURL = "nyt_covid-19_us/us-counties.json";
url = "/counties_db/counties_data";

getData(url);
//createMap();


