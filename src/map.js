import { stopPresentation } from "./presentation";

export var geoLayerGroup = new L.LayerGroup();
export var jsonLayerGroup = new L.LayerGroup();
export var csvLayerGroup = new L.LayerGroup();

let input = document.getElementById('filter-text-box');

var locationX = 51.505, 
    locationY = -0.09, 
    locationZ = 13;

function locateView() {
  if(localStorage.getItem('locationX')) {
    locationX = localStorage.getItem('locationX');
    locationY = localStorage.getItem('locationY');
    locationZ = localStorage.getItem('locationZ');
  }
} 

locateView();

function setCurrentLocation() {
locationX = map.getCenter().lat;
locationY = map.getCenter().lng;
locationZ = map.getZoom();
locationX = localStorage.setItem('locationX', locationX);
locationY = localStorage.setItem('locationY', locationY);
locationZ = localStorage.setItem('locationZ', locationZ);
}

export var map = L.map('mapid', {
preferCanvas: true,
}).setView([locationX, locationY], locationZ);

map.on('moveend', setCurrentLocation);

map.on("baselayerchange", function (e) {
  stopPresentation();
  input.value = '';
  localStorage.setItem("activeBaseLayer", e.name);

  let layers = [] 
  switch(e.name) {
    case 'csv':
      csvLayerGroup.eachLayer(layer => layers.push(layer));
      break;
    case 'geoJson':
      geoLayerGroup.eachLayer(layer => layers.push(layer));
      break;
    case 'json':
      jsonLayerGroup.eachLayer(layer => layers.push(layer));
      break;
  }

  var group = L.featureGroup(layers);
  if(Object.keys(group._layers).length !== 0) {
    map.fitBounds(group.getBounds());
  }

});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoibmlraWt3aWtpIiwiYSI6ImNrcXFleG5lazB4MmYycnFoaGhoYW1jd2UifQ.MCwmknwzMVPfSpWvEx6T5Q'
}).addTo(map);

let userMarker;
export function onMapClick(position) {
  if(userMarker) {
    userMarker.remove();
  }
    userMarker = L.circleMarker([position.latlng.lat, position.latlng.lng]);
    userMarker.addTo(map);
    userMarker.bindPopup(`My coords are: ${position.latlng.lat.toFixed(2)} : ${position.latlng.lng.toFixed(2)}`).openPopup();
}

export let layercontrol = L.control.layers().addTo(map);

