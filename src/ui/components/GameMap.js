export class GameMap {
  constructor(mapContainerId, onMapClick) {
    this.onMapClick = onMapClick;
    this.map = L.map(mapContainerId, {
      worldCopyJump: false,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 2,
      maxZoom: 5
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      bounds: [[-85, -180], [85, 180]],
      attribution: '© OpenStreetMap contributors',
      noWrap: true
    }).addTo(this.map);

    this.guessMarker = null;
    this.solutionMarker = null;
    this.line = null;

     this.map.on('click', (e) => {
      this.setGuessMarker(e.latlng);
      if (this.onMapClickCallback) {
        this.onMapClickCallback(e.latlng);
      }
    });
  }


   setOnMapClick(callback) {
    this.onMapClickCallback = callback;
  }

  
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

  setGuessMarker(latlng) {
    if (this.guessMarker) {
      this.guessMarker.setLatLng(latlng);
    } else {
      this.guessMarker = L.marker(latlng, { draggable: false }).addTo(this.map);
    }
  }

  showSolutionMarker(latlng) {
    if (this.solutionMarker) {
      this.solutionMarker.setLatLng(latlng);
    } else {
      
      this.solutionMarker = L.marker(latlng).addTo(this.map);
    }
  }


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