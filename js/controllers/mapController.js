angular.module('starter').controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    'LocationsService',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      LocationsService
      ) {

      $scope.$on("$stateChangeSuccess", function() {
        var epsg4326_ll = [-157.237324185, 71.1479777401];
        var epsg4326_ur = [-156.339008901, 71.4361019042];
        var epsg3857_ll = proj4('EPSG:3857', epsg4326_ll);
        var epsg3857_ur = proj4('EPSG:3857', epsg4326_ur);

        $scope.map = {
          defaults: {
            minZoom: 9,
            maxZoom: 14,
            zoomControlPosition: 'bottomleft'
          },
          center: {
            lat: 71.292574658,
            lng: -156.788166543,
            zoom: 11
          },
          maxbounds: {
            southWest: {
              lat: epsg4326_ll[1],
              lng: epsg4326_ll[0]
            },
            northEast: {
              lat: epsg4326_ur[1],
              lng: epsg4326_ur[0]
            }
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          },
          layers: {
            baselayers: {
              bdl: {
                name: 'BDL',
                type: 'imageOverlay',
                url: 'http://wms.alaskamapped.org/bdl?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=BestDataAvailableLayer&tiled=true&WIDTH=3000&HEIGHT=3000&CRS=EPSG%3A3857&STYLES=&BBOX=' + epsg3857_ll[0] + ',' + epsg3857_ll[1] + ',' + epsg3857_ur[0] + ',' + epsg3857_ur[1],
                bounds: [[epsg4326_ll[1], epsg4326_ll[0]], [epsg4326_ur[1], epsg4326_ur[0]]],
                layerParams: {
                  showOnSelector: false,
                  continuousWorld: true
                }
              },
            },
            overlays: {
              barrow: {
                name: 'Barrow',
                type: 'imageOverlay',
                url: 'http://geonode-test.iarc.uaf.edu/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=geonode%3Abarrow_epsg3857&tiled=true&WIDTH=1100&HEIGHT=1100&CRS=EPSG%3A3857&STYLES=&BBOX=' + epsg3857_ll[0] + ',' + epsg3857_ll[1] + ',' + epsg3857_ur[0] + ',' + epsg3857_ur[1],
                bounds: [[epsg4326_ll[1], epsg4326_ll[0]], [epsg4326_ur[1], epsg4326_ur[0]]],
                layerParams: {
                  showOnSelector: true,
                  continuousWorld: true
                }
              }
            }
          }
        };

        $scope.map.markers['barrow'] = {
          lat: 71.295556,
          lng: -156.766389,
          message: "Barrow, Alaska",
          focus: true,
          draggable: false
        };
      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      // Place GPS coordinate on map.
      $scope.locate = function(){
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 11;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };
          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });
      };
    }]);