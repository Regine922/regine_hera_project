import { Geolocation } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';

@Injectable()
export class GeoService {
  private watch: any;
  private geoOptions: any = {
    maximumAge: 5000,
    timeout: 7000,
    enableHighAccuracy: true
  };

  constructor(
    private geo: Geolocation
  ) {

  }

  getCurrentLocation(): Promise<any> {
    return new Promise(resolve => {
      this.geo.getCurrentPosition(this.geoOptions).then((res) => {
        // resp.coords.latitude
        // resp.coords.longitude
        resolve(res);
      }).catch((error) => {
        console.log('Error getting location ', error);
      });
    });
  }

  watchLocation(): Promise<any> {
    this.watch = this.geo.watchPosition(this.geoOptions);
    return new Promise(resolve => {
      this.watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        resolve(data);
      });
    });
  }

  unsubscribeWatch() {
    this.watch.unsubscribe();
  }
}
