'use strict';

/**
 * Represents a photo with its URL and geographical coordinates.
 */
export class Photo {
  constructor(url, lat, lng) {
    this.url = url;
    this.lat = lat;
    this.lng = lng;
  }
}
