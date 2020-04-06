/* ---------------------------------------------- */
/* helper functions Beginning */
/* ---------------------------------------------- */
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function sumSimilarKeysArrStateObjs(arrObjs){
  return arrObjs.reduce(function(acc, val){
     var o = acc.filter(function(obj){
         return obj.Province_State==val.Province_State;
     }).pop() || {Province_State:val.Province_State, confirmed_cases:0};
     
     o.confirmed_cases += val.confirmed_cases;
     acc.push(o);
     return acc;
 },[]);
 }
 
 function sumSimilarKeysArrObjsStateDeath(arrObjs){
   return arrObjs.reduce(function(acc, val){
      var o = acc.filter(function(obj){
          return obj.Province_State==val.Province_State;
      }).pop() || {Province_State:val.Province_State, death:0};
      
      o.death += val.death;
      acc.push(o);
      return acc;
  },[]);
  }

  function creatNewArrOfObjectsStates(arrObj1, arrObj2){
    
     for(let i = 0; i < arrObj1.length; i++){
        arrObj1[i][0]['death'] = Object.values(arrObj2[i])[0]['death'];
     }
       console.log(arrNewObj);
      
   }

   function creatNewArrOfObjectsStates(arrObjConfirmed, arrObjDeath){
     let arrNewObj = [];
     
     for(let i = 0; i < arrObjConfirmed.length; i++){
        let newObj = {}
        newObj['Province_State'] = arrObjConfirmed[i]['Province_State'];
        newObj['confirmed_cases_excluding_death'] = arrObjConfirmed[i]['confirmed_cases'] - arrObjDeath[i]['death'];
        newObj['death'] = arrObjDeath[i]['death'];
        arrNewObj.push(newObj)
     }
       //console.log(arrNewObj);
       return arrNewObj
   }

/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */

const urlUSConfirmed = 'csse_covid_19_time_series/time_series_covid19_confirmed_US.json'
const urlUSDeath = 'csse_covid_19_time_series/time_series_covid19_deaths_US.json'

function getDataUS(urlUSConfirmed){

  Promise.all([
     d3.json(urlUSConfirmed),
     
  ]).then(([confirmed]) =>  {
 // console.log(confirmed);
  //console.log(deaths);
  for (var lastProperty in confirmed[0]);
 // console.log(lastProperty)

   var arrObjsConfirmed = confirmed.map((item) => {
            return {
               Province_State: item['Province_State'],
              'confirmed_cases': +item[lastProperty]
            } 
          });

//   console.log( arrObjsConfirmed)

var resultConfirmed = sumSimilarKeysArrStateObjs(arrObjsConfirmed).filter((d, index, self) =>
index === self.findIndex((t) => (
  t.Province_State === d.Province_State && t.confirmed_cases === d.confirmed_cases
))
);

//console.log(resultConfirmed)

var config = {
  type: 'horizontalBar',
  data: {
    labels: resultConfirmed .sort(function(a, b) {
     return b.confirmed_cases_excluding_death - a.confirmed_cases_excluding_death;
 }).map(b => b.Province_State).slice(0,20),
    datasets: [{
      label: "Confirmed Cases Excluding Deaths",
      backgroundColor: "#88C1F2",
      hoverBackgroundColor: "#88C1F2",
      data: resultConfirmed.map(d => d.confirmed_cases_excluding_death).sort((a,b)=> b - a).slice(0,20),
    }, ]
  },
  options: {
     scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontFamily: "'Open Sans Bold', sans-serif",
              fontSize: 11,
              color: "#40291C"
            },
            scaleLabel: {
              display: false
            },
            gridLines: {},
            stacked: false
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
              color: "#fff",
              zeroLineColor: "#fff",
              zeroLineWidth: 0,
             
            },
            ticks: {
              fontFamily: "'Open Sans Bold', sans-serif",
              fontSize: 11,
              color: "#40291C"
            },
            stacked: false
          }
        ]
      },
  }
};

var ctx = document.getElementById("stackedBarChart").getContext("2d");
new Chart(ctx, config);



}).catch(function(err) {
  console.log(err)
})
}

function getDataUSDeaths(urlUSDeath){

 Promise.all([
       d3.json(urlUSDeath),
    
 ]).then(([deaths]) =>  {
// console.log(confirmed);
 //console.log(deaths);
 for (var lastProperty in deaths[0]);
// console.log(lastProperty)

 var arrObjsDeath = deaths.map((item) => {
          return {
                   Province_State: item['Province_State'],
                'death': +item[lastProperty]
          } 
     });


var resultDeath = sumSimilarKeysArrObjsStateDeath(arrObjsDeath).filter((d, index, self) =>
index === self.findIndex((t) => (
 t.Province_State === d.Province_State && t.death === d.death
))
);

var config = {
 type: 'horizontalBar',
 data: {
   labels: resultDeath.sort(function(a, b) {
    return b.death- a.death;
}).map(b => b.Province_State).slice(0,20),
   datasets: [ {
     label: "Deaths",
     backgroundColor: "#8C4A32",
     hoverBackgroundColor: "#8C4A32",
     data: resultDeath.map(d => d.death).sort((a,b)=> b - a).slice(0,20)
   }]
 },
 options: {
    scales: {
       xAxes: [
         {
           ticks: {
             beginAtZero: true,
             fontFamily: "'Open Sans', sans-serif",
             fontSize: 11,
             color: "#40291C"
           },
           scaleLabel: {
             display: false
           },
           gridLines: {},
           stacked: true
         }
       ],
       yAxes: [
         {
           gridLines: {
             display: false,
             color: "#fff",
             zeroLineColor: "#fff",
             zeroLineWidth: 0,
             color: "#40291C"
           },
           ticks: {
             fontFamily: "'Open Sans', sans-serif",
             fontSize: 11,
             color: "#40291C"
           },
           stacked: true
         }
       ]
     },
 }
};

var ctx = document.getElementById("stackedBarChart").getContext("2d");
new Chart(ctx, config);

}).catch(function(err) {
 console.log(err)
})
}
 
var init =()=> getDataUS(urlUSConfirmed);

var confirmed = (urlUSConfirmed) => getDataUS(urlUSConfirmed);
var deaths =(urlUSDeath) => getDataUSDeaths(urlUSDeath);
  

