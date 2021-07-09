import {selectTable, renderJsonTable, renderCSVTable} from './table.js';
import {map, onMapClick} from './map';
import {renderGeoJson, renderJson, renderCSV} from './fetch-markers';
import './presentation';

map.on('click', onMapClick);

async function renderAll() {
  return await Promise.all([renderGeoJson(), renderJson(), renderCSV()]);
}

renderAll().then(() => {
  let tableName = localStorage.getItem('activeBaseLayer');
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


