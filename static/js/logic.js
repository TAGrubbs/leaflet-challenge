function createMap(earthQuakes){

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });
  var baseMaps ={
    "Light Map": lightmap
  };
  var overlayMaps = {
  "Earthquakes": earthQuakes
  };
 
  var map = L.map("map", {
  center: [40.75, -111.87],
  zoom: 5,
  layers: [lightmap, earthQuakes]
  });
  L.control.layers(baseMaps, overlayMaps).addTo(map);
  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function(){
    var div = L.DomUtil.create("div","legend");
    return div;
  }

  info.addTo(map);

  document.querySelector(".legend").innerHTML=displayLegend();
}
function getColor(x){
  switch(true){
     case (x<1):
      return "chartreuse";
     case (x<2):
      return "greenyellow";
     case (x<3):
      return "gold";
     case (x<4):
      return "DarkOrange";
     case (x<5):
      return "Peru";
     default:
      return "red";
    };
}

function displayLegend(){
  var legendInfo = [{
      limit: "Mag: 0-1",
      color: "chartreuse"
  },{
      limit: "Mag: 1-2",
      color: "greenyellow"
  },{
      limit:"Mag: 2-3",
      color:"gold"
  },{
      limit:"Mag: 3-4",
      color:"DarkOrange"
  },{
      limit:"Mag: 4-5",
      color:"Peru"
  },{
      limit:"Mag: 5+",
      color:"red"
  }];

  var header = "<h3>Magnitude</h3><hr>";

  var strng = "";
 
  for (i = 0; i < legendInfo.length; i++){
      strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
  }
  
  return header+strng;

}
function createMarkers(response) {
    
    var earthquakes = response.features;
    var quakeMarkers = [];
  
    for (var index = 0; index < earthquakes.length; index++) {
      var quake = earthquakes[index];
  
      var quakeMarker = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
        stroke: true,
        weight: 1,
        opacity: .25,
        color: "black",
        fillOpacity: .50,
        fillColor: getColor(quake.properties.mag),
        radius: quake.properties.mag*5
      })
        .bindPopup("<h3>" + quake.properties.place + "<h3><h3>Magnitude: " + quake.properties.mag + "<h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
    
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);  
