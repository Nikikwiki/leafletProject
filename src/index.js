import { renderCSV, renderGeoJson, renderJson } from './fetch-markers';
import { jsonLayerGroup, map, onMapClick } from './map';
import { renderCSVTable, renderJsonTable, selectTable } from './table.js';

import './presentation';

map.on('click', onMapClick);

async function renderAll() {
  return await Promise.all([renderGeoJson(), renderJson(), renderCSV()]);
}

renderAll().then(() => {
  const hashArray = window.location.hash.split('/');
  let tableName = hashArray[3];
  if(tableName) {
    switch(tableName) {
        case 'csv': 
          renderCSVTable();
          break;
        case 'geoJson': 
          renderJsonTable('geoJson');
          break;
        case 'json':
          renderJsonTable('json');
    }
  } else {
    let layers = [] 
    jsonLayerGroup.eachLayer(layer => layers.push(layer));
    jsonLayerGroup.addTo(map);

    let group = L.featureGroup(layers);
    if(Object.keys(group._layers).length !== 0) {
      map.fitBounds(group.getBounds());
    }

    renderJsonTable('json');
  }
});

map.on('load', loadFirstLayer);
map.on('baselayerchange', selectTable);


function loadFirstLayer() {
  console.log(124);
}


