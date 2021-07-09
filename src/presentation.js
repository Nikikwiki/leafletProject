import { map, csvLayerGroup, geoLayerGroup, jsonLayerGroup } from './map';

let lastIndex = 0;
let stopPresentationFlag = true;
let timer;
let image = document.getElementById('presentation__img');

let play = document.querySelector(".presentation");
play.addEventListener("click", () => {
  if(!stopPresentationFlag) {
    stopPresentation();
  } else {
    stopPresentationFlag = false;
    image.src = './stop-button.svg';
    showPresentation();
  }
});

function showPresentation() {
  const layers = [];
  let tableName = localStorage.getItem("activeBaseLayer");
  switch (tableName) {
    case "csv":
      csvLayerGroup.eachLayer((layer) => layers.push(layer));
      break;
    case "geoJson":
      geoLayerGroup.eachLayer((layer) => layers.push(layer));
      break;
    case "json":
      jsonLayerGroup.eachLayer((layer) => layers.push(layer));
  }
  const layer = layers[lastIndex];
  const coords = layer.getLatLng();
  map.setView([coords.lat, coords.lng], 18);
  layer.togglePopup();
  lastIndex += 1;
  if (lastIndex == layers.length) {
    lastIndex = 0;
  }
  if(!stopPresentationFlag) {
    timer = setTimeout(() => showPresentation(), 1000);
  }
}

export function stopPresentation() {
  clearTimeout(timer);
  lastIndex = 0;
  stopPresentationFlag = true;
  image.src = './play.svg';
}