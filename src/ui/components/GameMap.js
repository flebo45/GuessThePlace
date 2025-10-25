/**
 * GameMap component that encapsulates a Leaflet map for the game.
 * It allows setting guess markers, solution markers, and drawing lines between them.
 */
export class GameMap {
  constructor(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
      throw new Error("GameMap expects a DOM element, not an ID string");
    }

    this.map = L.map(containerElement, {
      worldCopyJump: false,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 2,
      maxZoom: 5,
    }).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      bounds: [
        [-85, -180],
        [85, 180]
      ],
      attribution: "© OpenStreetMap contributors",
      noWrap: true,
    }).addTo(this.map);

    this.guessMarker = null;
    this.solutionMarker = null;
    this.line = null;
    this.interactive = true;

    this.map.on("click", (e) => {
      if (!this.interactive) return;
      this.setGuessMarker(e.latlng);
      if (this.onMapClickCallback) {
        this.onMapClickCallback(e.latlng);
      }
    });
  }


  /**
   * Sets a callback function to handle map click events.
   * @param {Function} callback - The function to call when the map is clicked.
   */
   setOnMapClick(callback) {
    this.onMapClickCallback = callback;
  }

  /**
   * Sets the interactivity of the map.
   * @param {boolean} enabled - Whether to enable or disable interactivity.
   */
  setInteractive(enabled) {
    this.interactive = !!enabled;
  }

  /**
   * Enables interaction with the map.
   */
  enableInteraction() {
    this.setInteractive(true);
  }

  /**
   * Disables interaction with the map.
   */
  disableInteraction() {
    this.setInteractive(false);
  }

  /**
   * Resets the game map to its initial state.
   */
  reset() {
    if (this.guessMarker) {
      this.map.removeLayer(this.guessMarker);
      this.guessMarker = null;
    }
    if (this.solutionMarker) {
      this.map.removeLayer(this.solutionMarker);
      this.solutionMarker = null;
    }
    if (this.line) {
      this.map.removeLayer(this.line);
      this.line = null;
    }
  }

  /**
   * Sets the guess marker on the map.
   * @param {LatLng} latlng - The latitude and longitude to place the guess marker.
   */
  setGuessMarker(latlng) {
    if (this.guessMarker) {
      this.guessMarker.setLatLng(latlng);
    } else {
      this.guessMarker = L.marker(latlng, { draggable: false }).addTo(this.map);
    }
  }

  /**
   * Shows the solution marker on the map.
   * @param {LatLng} latlng - The latitude and longitude to place the solution marker.
   */
  showSolutionMarker(latlng) {
    if (this.solutionMarker) {
      this.solutionMarker.setLatLng(latlng);
    } else {
      
      this.solutionMarker = L.marker(latlng).addTo(this.map);
    }
  }

  /**
   * Shows the line between the guess and solution markers.
   */
  showLineBetweenMarkers() {
    if (this.guessMarker && this.solutionMarker) {
      const latlngs = [this.guessMarker.getLatLng(), this.solutionMarker.getLatLng()];
      if (this.line) {
        this.line.setLatLngs(latlngs);
      } else {
        this.line = L.polyline(latlngs, { color: 'red', weight: 3 }).addTo(this.map);
      }
    }
  }

  
}