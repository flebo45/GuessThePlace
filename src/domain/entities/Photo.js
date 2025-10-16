'use strict';

export class Photo {
    constructor(url, latitude = null, longitude = null) {
        this.url = url;
        this.latitude = latitude;
        this.longitude = longitude;
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
