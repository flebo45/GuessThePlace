'use strict';

export class Photo {
    constructor(id, url, latitude = null, longitude = null) {
        this.id = id;
        this.url = url;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getId() {
        return this.id;
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
