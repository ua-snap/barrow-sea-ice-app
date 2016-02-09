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

        proj4.defs([
          [ 'EPSG:3338', '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs' ]
        ]);

        // The EPSG:3338 boundary values used to fetch raw PNG images from
        // various WMS servers. These boundary values are a (nearly) perfect
        // square. They were also borrowed from Leaflet's WMS tile boundaries.
        // You can set these values to anything that forms a perfect square,
        // but the image seems to be sharper when it aligns to the values
        // Leaflet chooses.
        var epsg3338_ll = [-116210.93749999953, 2354980.4687499963];
        var epsg3338_ur = [-88867.1874999995, 2382324.2187499986];

        // Convert the EPSG:3338 boundaries to EPSG:4326 lat/lon values to set
        // maxbounds and layer bounds.
        var epsg4326_ll = proj4('EPSG:3338', 'EPSG:4326', epsg3338_ll);
        var epsg4326_ur = proj4('EPSG:3338', 'EPSG:4326', epsg3338_ur);

        $scope.map = {
          defaults: {
            crs: new L.Proj.CRS('EPSG:3338', proj4.defs('EPSG:3338'), 
              {
                bounds: L.bounds([-3500000,-3500000], [3500000,3500000]),
                origin: [-3500000,3500000],
                resolutions: [27343.75, 13671.875, 6835.9375, 3417.96875, 1708.984375, 854.4921875, 427.24609375, 213.623046875, 106.8115234375, 53.40576171875, 26.702880859375, 13.3514404296875, 6.67572021484375, 3.337860107421875, 1.6689300537109375, 0.8344650268554688, 0.4172325134277344, 0.2086162567138672, 0.1043081283569336, 0.0521540641784668, 0.0260770320892334]
              }
            ),
            minZoom: 8,
            maxZoom: 14,
            zoomControlPosition: 'bottomleft'
          },
          center: {
            lat: 71.295556,
            lng: -156.766389,
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
                url: 'http://wms.alaskamapped.org/bdl?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=BestDataAvailableLayer&tiled=true&WIDTH=3000&HEIGHT=3000&CRS=EPSG%3A3338&STYLES=&BBOX=' + epsg3338_ll[0] + ',' + epsg3338_ll[1] + ',' + epsg3338_ur[0] + ',' + epsg3338_ur[1],
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
                url: 'http://geonode-test.iarc.uaf.edu/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=geonode%3Abarrow_radar_3338_transparent_really&tiled=true&WIDTH=1023&HEIGHT=1023&CRS=EPSG%3A3338&STYLES=&BBOX=' + epsg3338_ll[0] + ',' + epsg3338_ll[1] + ',' + epsg3338_ur[0] + ',' + epsg3338_ur[1],
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
          lat: $scope.map.center.lat,
          lng: $scope.map.center.lng,
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