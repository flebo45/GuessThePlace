import { GameMap } from '../../ui/components/GameMap.js';

/**
 * Controller class for managing game map-related operations.
 */
export class GameMapController {
  constructor(mapContainerId) {
    this.mapContainerId = mapContainerId;
    const container = document.getElementById(mapContainerId);
    if (!container) throw new Error("Map container not found");
    this.gameMap = new GameMap(container);
  }

  /**
   * Sets a callback function to handle map click events.
   * @param {Function} callback - The function to call when the map is clicked.
   */
  onMapClick(callback) {
    this.gameMap.setOnMapClick(callback);
  }
  
  /**
   * Sets the interactivity of the map.
   * @param {boolean} enabled - Whether to enable or disable interactivity.
   */
  setInteractive(enabled) {
    if (this.gameMap && typeof this.gameMap.setInteractive === 'function') {
      this.gameMap.setInteractive(enabled);
    }
  }

  /**
   * Disables interaction with the map.
   */
  disableInteraction() {
    this.setInteractive(false);
  }

  /**
   * Enables interaction with the map.
   */
  enableInteraction() {
    this.setInteractive(true);
  }

  /**
   * Resets the game map to its initial state.
   */
  reset() {
    this.gameMap.reset();
  }

  /**
   * Shows the solution marker on the map.
   * @param {Object} latlng - The latitude and longitude of the solution.
   */
  showSolution(latlng) {
    this.gameMap.showSolutionMarker(latlng);
  }

  /**
   * Shows a line between the guess and the solution markers.
   */
  showLineBetween() {
    this.gameMap.showLineBetweenMarkers();
  }

  /**
   * Invalidates the map size.
   */
  invalidateSize() {
    // this.gameMap è la nostra classe, this.gameMap.map è l'oggetto Leaflet
    if (this.gameMap && this.gameMap.map) {
      this.gameMap.map.invalidateSize();
    }
  }
}
