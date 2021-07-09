import { csvTableData, geoJsonTableData, jsonTableData } from "./fetch-markers";
import { csvLayerGroup, geoLayerGroup, jsonLayerGroup, map } from "./map";
import { stopPresentation } from './presentation';

export let input = document.querySelector("#filter-text-box");

let tableName = "csv";

export function selectTable(e) {
  const eGridDiv = document.getElementById("myGrid");
  while (eGridDiv.firstChild) {
    eGridDiv.removeChild(eGridDiv.lastChild);
  }
  tableName = e.name;
  e.name == "csv" ? renderCSVTable() : renderJsonTable(e.name);
}

export function renderJsonTable(tableName) {
  let columnDefs = [];
  let rowData = [];
  let props = [];
  let tableData;

  if (tableName == "geoJson") {
    props = Object.keys(geoJsonTableData[0].properties);
    props = props.concat(["lat", "lng"]);
    tableData = geoJsonTableData;
  } else {
    props = Object.keys(jsonTableData[0].properties);
    props = props.concat(["lat", "lng"]);
    tableData = jsonTableData;
  }

  props.forEach((p) => {
    let a = { field: `${p}` };
    columnDefs.push(a);
  });

  tableData.forEach((data) => {
    let a = {
      lat: `${data.geometry.coordinates[0]}`,
      lng: `${data.geometry.coordinates[1]}`,
    };
    a = Object.assign(a, data.properties);
    rowData.push(a);
  });

  const gridOptions = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: columnDefs,
    rowData: rowData,
    onRowClicked: function (e) {
      map.setView([e.data.lat, e.data.lng], 18);
      stopPresentation();
      toggleJsonMarker(e);
    },
  };

  const eGridDiv = document.querySelector("#myGrid");
  new agGrid.Grid(eGridDiv, gridOptions);
  gridOptions.api.sizeColumnsToFit();

  const event = new Event('input');

  input.addEventListener("input", () => {
    stopPresentation();
    gridOptions.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );

    changeHash();

    geoLayerGroup.clearLayers();
    jsonLayerGroup.clearLayers();

    gridOptions.api.forEachNodeAfterFilter(node => {
        geoLayerGroup.addLayer(
          L.circleMarker([node.data.lat, node.data.lng])
            .bindPopup(`Address: ${node.data.address} <br> Name: ${node.data.name}`)
        )
        jsonLayerGroup.addLayer(
          L.circleMarker([node.data.lat, node.data.lng])
            .bindPopup(`Address: ${node.data.adres} <br> Name: ${node.data.name}`)
        )
    });
  });

  const hashArray = window.location.hash.split('/');
  if(hashArray[4] !== '') {
    input.dispatchEvent(event);
  }
}

export function renderCSVTable() {
  let columnDefs = [];
  let rowData = [];

  columnDefs.push({ field: "name_en" });
  columnDefs.push({ field: "name_ru" });
  columnDefs.push({ field: "escalator" });
  columnDefs.push({ field: "lat" });
  columnDefs.push({ field: "lon" });
  columnDefs.push({ field: "min_rail_width" });

  csvTableData.forEach((data) => {
    rowData.push(data);
  });

  const gridOptions = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: columnDefs,
    rowData: rowData,
    onRowClicked: function (e) {
      map.setView([e.data.lat, e.data.lon], 18);
      stopPresentation();
      toggleCsvMarker(e);
    },
  };

  const eGridDiv = document.querySelector("#myGrid");
  new agGrid.Grid(eGridDiv, gridOptions);
  gridOptions.api.sizeColumnsToFit();

  const event = new Event('input');
  
  input.addEventListener("input", () => {
    stopPresentation();
    gridOptions.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );

    changeHash();

    csvLayerGroup.clearLayers();
    gridOptions.api.forEachNodeAfterFilter(node => {
      csvLayerGroup.addLayer(
        L.circleMarker(node.data).bindPopup(`Address: ${node.data.name_ru}`)
      )
    });
  });
  
  const hashArray = window.location.hash.split('/');
  if(hashArray[4] !== '') {
    input.dispatchEvent(event);
  }
}

function toggleJsonMarker(e) {
  if (tableName == "geoJson") {
    geoLayerGroup.eachLayer((layer) => {
      const coords = layer.getLatLng();
      if (coords.lat == e.data.lat && coords.lng == e.data.lng) {
        layer.togglePopup();
      }
    });
  } else {
    jsonLayerGroup.eachLayer((layer) => {
      const coords = layer.getLatLng();
      if (coords.lat == e.data.lat && coords.lng == e.data.lng) {
        layer.togglePopup();
      }
    });
  }
}

function toggleCsvMarker(e) {
  csvLayerGroup.eachLayer((layer) => {
    const coords = layer.getLatLng();
    if (coords.lat == e.data.lat && coords.lng == e.data.lon) {
      layer.togglePopup();
    }
  });
}

function changeHash() {
  const hashArray = window.location.hash.split('/');
  hashArray[4] = input.value;
  window.location.hash = hashArray.join('/');
}