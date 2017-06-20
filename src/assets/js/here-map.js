//
// map.setCenter({
//   lat: 52.5159,
//   lng: 13.3777
// });
// map.setZoom(14);
var defaultLayers;
var map;
var routeInstructionsContainer;
var platform;
var ui;
var bubble;
var mapObjects = [];
var hereMap = {
  initializeMap: function(appId, appCode, useCIT, useHTTPS) {
    platform = new H.service.Platform({
      app_id: appId,
      app_code: appCode,
      useCIT: useCIT,
      useHTTPS: useHTTPS
    });
    defaultLayers = platform.createDefaultLayers();
  },
  createMap: function(mapId) {
    map = new H.Map(document.getElementById(mapId), defaultLayers.normal.map);

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    ui = H.ui.UI.createDefault(map, defaultLayers);
  },
  createPanel: function(panelId) {
    routeInstructionsContainer = document.getElementById(panelId);
  },
  moveMapTo: function(coordinate) {
    map.setCenter(coordinate);
  },
  zoomMapTo: function(zoom) {
    map.setZoom(zoom);
  },
  addMarker: function(coordinate, isMe) {
    var svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 16 16" width="48" height="48" xml:space="preserve">
	<path fill="#` + (isMe ? 'f5923d' : 'f53237') + `" class="path1" d="M8 2.1c1.1 0 2.2 0.5 3 1.3 0.8 0.9 1.3 1.9 1.3 3.1s-0.5 2.5-1.3 3.3l-3 3.1-3-3.1c-0.8-0.8-1.3-2-1.3-3.3 0-1.2 0.4-2.2 1.3-3.1 0.8-0.8 1.9-1.3 3-1.3z"/>
</svg>`;

    // Add the first marker
    var icon = new H.map.Icon(svgMarkup);
    var marker = new H.map.Marker(coordinate, {
      icon: icon
    });
    map.addObject(marker);
    mapObjects.push(marker);
  },
  clearMap: function() {
    if (mapObjects.length > 0) {
      map.removeObjects(mapObjects);
      mapObjects = [];
    }
  },
  calculateRoute: function(routeRequestParams) {
    var router = platform.getRoutingService();

    router.calculateRoute(
      routeRequestParams,
      this.onRouteSuccess,
      this.onRouteError
    );
  },
  onRouteSuccess: function(result) {
    var route = result.response.route[0];
    /*
     * The styling of the route response on the map is entirely under the developer's control.
     * A representitive styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    hereMap.addRouteShapeToMap(route);
    hereMap.addManueversToMap(route);

    hereMap.addWaypointsToPanel(route.waypoint);
    hereMap.addManueversToPanel(route);
    hereMap.addSummaryToPanel(route.summary);
    // ... etc.
  },

  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param  {Object} error  The error message received.
   */
  onRouteError: function(error) {
    console.log('Ooops!');
    return false;
  },
  addRouteShapeToMap: function(route) {
    var strip = new H.geo.Strip();
    var routeShape = route.shape;
    var polyline;

    routeShape.forEach(function(point) {
      var parts = point.split(',');
      strip.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(strip, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    mapObjects.push(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
  },
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  addManueversToMap: function(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {
        anchor: {
          x: 8,
          y: 8
        }
      }),
      group = new H.map.Group(),
      i,
      j;

    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
      for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        var marker = new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude
        }, {
          icon: dotIcon
        });
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }

    group.addEventListener('tap', function(evt) {
      map.setCenter(evt.target.getPosition());
      hereMap.openBubble(
        evt.target.getPosition(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
    mapObjects.push(group);
  },
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  addWaypointsToPanel: function(waypoints) {



    var nodeH3 = document.createElement('h3'),
      waypointLabels = [],
      i;


    for (i = 0; i < waypoints.length; i += 1) {
      waypointLabels.push(waypoints[i].label)
    }

    nodeH3.textContent = waypointLabels.join(' - ');

    routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
  },

  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  addSummaryToPanel: function(summary) {
    var summaryDiv = document.createElement('div'),
      content = '';
    content += '<b>Total distance</b>: ' + summary.distance + 'm. <br/>';
    content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft = '5%';
    summaryDiv.style.marginRight = '5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  },

  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  addManueversToPanel: function(route) {



    var nodeOL = document.createElement('ol'),
      i,
      j;

    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft = '5%';
    nodeOL.style.marginRight = '5%';
    nodeOL.className = 'directions';

    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
      for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];

        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');

        spanArrow.className = 'arrow ' + maneuver.action;
        spanInstruction.innerHTML = maneuver.instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);

        nodeOL.appendChild(li);
      }
    }

    routeInstructionsContainer.appendChild(nodeOL);
  },
  searchPlace: function(query) {
    var geocoder = platform.getGeocodingService();
    var landmarkGeocodingParameters = {
      searchtext: query,
      jsonattributes: 1
    };

    geocoder.search(
      landmarkGeocodingParameters,
      this.onSearchSuccess,
      this.onSearchError
    );
  },
  onSearchSuccess: function(result) {
    var locations = result.response.view[0].result;
    /*
     * The styling of the geocoding response on the map is entirely under the developer's control.
     * A representitive styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    hereMap.addLocationsToMap(locations);
    hereMap.addLocationsToPanel(locations);
    // ... etc.
  },

  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param  {Object} error  The error message received.
   */
  onSearchError: function(error) {
    console.log('Ooops!');
  },
  openBubble: function(position, text) {
    if (!bubble) {
      bubble = new H.ui.InfoBubble(
        position, {
          content: text
        });
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  },

  /**
   * Creates a series of list items for each location found, and adds it to the panel.
   * @param {Object[]} locations An array of locations as received from the
   *                             H.service.GeocodingService
   */
  addLocationsToPanel: function(locations) {

    var nodeOL = document.createElement('ul'),
      i;

    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft = '5%';
    nodeOL.style.marginRight = '5%';


    for (i = 0; i < locations.length; i += 1) {
      var li = document.createElement('li'),
        divLabel = document.createElement('div'),
        landmark = locations[i].place.locations[0],
        content = '<strong style="font-size: large;">' + landmark.name + '</strong></br>';
      position = {
        lat: locations[i].place.locations[0].displayPosition.latitude,
        lng: locations[i].place.locations[0].displayPosition.longitude
      };

      content += '<strong>houseNumber:</strong> ' + landmark.address.houseNumber + '<br/>';
      content += '<strong>street:</strong> ' + landmark.address.street + '<br/>';
      content += '<strong>district:</strong> ' + landmark.address.district + '<br/>';
      content += '<strong>city:</strong> ' + landmark.address.city + '<br/>';
      content += '<strong>postalCode:</strong> ' + landmark.address.postalCode + '<br/>';
      content += '<strong>county:</strong> ' + landmark.address.county + '<br/>';
      content += '<strong>country:</strong> ' + landmark.address.country + '<br/>';
      content += '<br/><strong>position:</strong> ' +
        Math.abs(position.lat.toFixed(4)) + ((position.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(position.lng.toFixed(4)) + ((position.lng > 0) ? 'E' : 'W');

      divLabel.innerHTML = content;
      li.appendChild(divLabel);

      nodeOL.appendChild(li);
    }

    locationsContainer.appendChild(nodeOL);
  },


  /**
   * Creates a series of H.map.Markers for each location found, and adds it to the map.
   * @param {Object[]} locations An array of locations as received from the
   *                             H.service.GeocodingService
   */
  addLocationsToMap: function(locations) {
    var group = new H.map.Group(),
      position,
      i;

    // Add a marker for each location found
    for (i = 0; i < locations.length; i += 1) {
      position = {
        lat: locations[i].place.locations[0].displayPosition.latitude,
        lng: locations[i].place.locations[0].displayPosition.longitude
      };
      marker = new H.map.Marker(position);
      marker.label = locations[i].place.locations[0].name;
      group.addObject(marker);
    }

    group.addEventListener('tap', function(evt) {
      map.setCenter(evt.target.getPosition());
      openBubble(
        evt.target.getPosition(), evt.target.label);
    }, false);

    // Add the locations group to the map
    map.addObject(group);
    map.setViewBounds(group.getBounds());
    map.setZoom(Math.min(map.getZoom(), 16));
  }
}

Number.prototype.toMMSS = function() {
  return Math.floor(this / 60) + ' minutes ' + (this % 60) + ' seconds.';
}

module.exports = {
  hereMap: hereMap
};
