'use strict';

export class Photo {
    constructor(url, latitude = null, longitude = null) {
        this.url = url;
        this.lat = latitude;
        this.lng = longitude;
    }

    getUrl() {
        return this.url;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }
}
