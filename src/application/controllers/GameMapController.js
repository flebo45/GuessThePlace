// src/application/controllers/GameMapController.js

import { GameMap } from '../../ui/components/GameMap.js';

export class GameMapController {
  constructor(mapContainerId) {
    this.gameMap = new GameMap(mapContainerId);
  }

  onMapClick(callback) {
    this.gameMap.setOnMapClick(callback);
  }

  reset() {
    this.gameMap.reset();
  }

  /* setGuessPosition(latlng) {
    this.gameMap.setGuessMarker(latlng);
  } */

  setSolutionPosition(latlng) {
    this.gameMap.showSolutionMarker(latlng);
  }

  showLineBetween() {
    this.gameMap.showLineBetweenMarkers();
  }
}
