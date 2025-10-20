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
