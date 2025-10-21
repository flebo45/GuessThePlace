import { GameMap } from '../../ui/components/GameMap.js';

export class GameMapController {
  constructor(mapContainerId) {
    this.mapContainerId = mapContainerId;
    const container = document.getElementById(mapContainerId);
    if (!container) throw new Error("Map container not found");
    this.gameMap = new GameMap(container);
  }

  onMapClick(callback) {
    this.gameMap.setOnMapClick(callback);
  }

  setInteractive(enabled) {
    if (this.gameMap && typeof this.gameMap.setInteractive === 'function') {
      this.gameMap.setInteractive(enabled);
    }
  }

  disableInteraction() {
    this.setInteractive(false);
  }

  enableInteraction() {
    this.setInteractive(true);
  }

  reset() {
    this.gameMap.reset();
  }

  showSolution(latlng) {
    this.gameMap.showSolutionMarker(latlng);
  }

  showLineBetween() {
    this.gameMap.showLineBetweenMarkers();
  }

  invalidateSize() {
    // this.gameMap è la nostra classe, this.gameMap.map è l'oggetto Leaflet
    if (this.gameMap && this.gameMap.map) {
      this.gameMap.map.invalidateSize();
    }
  }
}
