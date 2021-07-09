import axios from 'axios'

import { csvLayerGroup, geoLayerGroup, jsonLayerGroup, layercontrol, map } from './map'

export var geoJsonTableData, jsonTableData, csvTableData;

export async function renderGeoJson() {
  await axios.get('bars.geojson').then((response) => {
    geoJsonTableData = response.data.features;
    response.data.features.forEach(f => {
      geoLayerGroup.addLayer(
        L.circleMarker(f.geometry.coordinates.reverse())
          .bindPopup(`Address: ${f.properties.address} <br> Name: ${f.properties.name}`)
      )
    })
    if (localStorage.getItem("activeBaseLayer") == "geoJson") {
      geoLayerGroup.addTo(map);
    }
    layercontrol.addBaseLayer(geoLayerGroup, 'geoJson');
  });
}


export async function renderJson() {
  await axios.get('js-layer.json').then((response) => {
    jsonTableData = response.data.features;
    response.data.features.forEach(f => {
      jsonLayerGroup.addLayer(
        L.circleMarker(f.geometry.coordinates.reverse())
        .bindPopup(`Address: ${f.properties.adres} <br> Name: ${f.properties.name}`)
        )
      })
      if (localStorage.getItem("activeBaseLayer") == "json") {
        jsonLayerGroup.addTo(map);
      }
      layercontrol.addBaseLayer(jsonLayerGroup, 'json');
  });
} 


function CSVToJSON(data) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ";";
  var titles = data.slice(0, data.indexOf("\n")).split(delimiter);
  return data
  .slice(data.indexOf("\n") + 1)
  .split("\n")
  .map(function(v) {
    var values = v.split(delimiter);
    return titles.reduce(function(obj, title, index) {
      return (obj[title] = values[index]), obj;
    }, {});
  });
};

export async function renderCSV() {
  await axios({
    url: 'portals.csv',
    method: 'GET',
    responseType: 'text',
  }).then((response) => {
    let json = CSVToJSON(response.data);
    csvTableData = json;
    json.forEach((f) => {
      csvLayerGroup.addLayer(
        L.circleMarker(f).bindPopup(`Address: ${f.name_ru}`)
      )
    })
  });
  if (localStorage.getItem("activeBaseLayer") == "csv") {
    csvLayerGroup.addTo(map);
  }

  layercontrol.addBaseLayer(csvLayerGroup, 'csv');
}