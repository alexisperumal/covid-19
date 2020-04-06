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

function getDataUS(){

  Promise.all([
     d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_US.json'),
     d3.json('csse_covid_19_time_series/time_series_covid19_deaths_US.json'),
     d3.json('nyt_covid-19_us/us-states.json'),
     d3.json('nyt_covid-19_us/us-counties.json')
     
  ]).then(([confirmed,deaths,states,counties]) =>  {
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

  var arrObjsDeath = deaths.map((item) => {
           return {
                    Province_State: item['Province_State'],
                 'death': +item[lastProperty]
           } 
      });

//   console.log( arrObjsConfirmed)

var resultConfirmed = sumSimilarKeysArrStateObjs(arrObjsConfirmed).filter((d, index, self) =>
index === self.findIndex((t) => (
  t.Province_State === d.Province_State && t.confirmed_cases === d.confirmed_cases
))
);

//console.log(resultConfirmed)

var resultDeath = sumSimilarKeysArrObjsStateDeath(arrObjsDeath).filter((d, index, self) =>
index === self.findIndex((t) => (
  t.Province_State === d.Province_State && t.death === d.death
))
);
console.log(resultDeath)

console.log(resultDeath.map(d => d.death).sort((a,b)=> b - a).slice(0,15))

console.log(creatNewArrOfObjectsStates(resultConfirmed,resultDeath))
var casesUS = creatNewArrOfObjectsStates(resultConfirmed,resultDeath)

var config = {
  type: 'horizontalBar',
  data: {
    labels: casesUS.sort(function(a, b) {
     return b.confirmed_cases_excluding_death - a.confirmed_cases_excluding_death;
 }).map(b => b.Province_State).slice(0,20),
    datasets: [{
      label: "Confirmed Cases Excluding Deaths",
      backgroundColor: "#88C1F2",
      hoverBackgroundColor: "#88C1F2",
      data: casesUS.map(d => d.confirmed_cases_excluding_death).sort((a,b)=> b - a).slice(0,20),
    }, {
      label: "Deaths",
      backgroundColor: "#8C2A2A",
      hoverBackgroundColor: "#8C2A2A",
      data: resultDeath.map(d => d.death).sort((a,b)=> b - a).slice(0,20)
    }]
  },
  options: {
     scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontFamily: "'Open Sans Bold', sans-serif",
              fontSize: 11
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
              zeroLineWidth: 0
            },
            ticks: {
              fontFamily: "'Open Sans Bold', sans-serif",
              fontSize: 11
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
 
getDataUS();



