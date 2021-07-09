import { renderCSV, renderGeoJson, renderJson } from './fetch-markers';
import { map, onMapClick } from './map';
import { renderCSVTable, renderJsonTable, selectTable } from './table.js';

import './presentation';

map.on('click', onMapClick);

async function renderAll() {
  return await Promise.all([renderGeoJson(), renderJson(), renderCSV()]);
}

renderAll().then(() => {
  const hashArray = window.location.hash.split('/');
  let tableName = hashArray[3];

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
      
});

map.on('baselayerchange', selectTable);


