import * as HereMap from '../assets/js/here-map';
import { Injectable } from '@angular/core';

@Injectable()
export class HereService1 {
  constructor(
  ) {
  }

  initializeMap(appId: string, appCode: string, useCIT: boolean, useHTTPS: boolean) {
    HereMap.hereMap.initializeMap(appId, appCode, useCIT, useHTTPS);
  }

  createMap(div: string) {
    HereMap.hereMap.createMap(div);
  }

  createPanel(div: string){
    HereMap.hereMap.createPanel(div);
  }

  clearMap(){
    HereMap.hereMap.clearMap();
  }

  moveMapToCoordinate(coordinate: any, marker: boolean, isMe: boolean) {
    HereMap.hereMap.moveMapTo(coordinate);
    if (marker) {
      this.addMarker(coordinate, isMe);
    }
  }

  zoomMapTo(zoom: number) {
    HereMap.hereMap.zoomMapTo(zoom);
  }

  addMarker(coordinate: any, isMe: boolean) {
    HereMap.hereMap.addMarker(coordinate, isMe);
  }

  calculateRoute(from: any, to: any, mode: any) {
    let modeStr = '';
    switch (mode) {
      case 'drive':
        modeStr = 'fastest;car';
        break;
      case 'walk':
        modeStr = 'shortest;pedestrian';
        break;
      case 'public':
        modeStr = 'fastest;publicTransport';
        break;
    }

    let routeRequestParams = {
      mode: modeStr,
      representation: 'display',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: from, // Brandenburg Gate
      waypoint1: to // Friedrichstraße Railway Station
    };
    HereMap.hereMap.calculateRoute(routeRequestParams);
  }

  searchPlace(query: string){
    HereMap.hereMap.searchPlace(query);
  }


}
