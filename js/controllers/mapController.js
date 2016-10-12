angular.module('starter').controller('MapController', ['$scope',
  '$cordovaGeolocation',
  '$stateParams',
  '$ionicModal',
  function(
    $scope,
    $cordovaGeolocation,
    $stateParams,
    $ionicModal
    ) {

    var epsg4326_ll = [-157.237324185, 71.1479777401];
    var epsg4326_ur = [-156.339008901, 71.4361019042];
    var epsg3857_ll = proj4('EPSG:3857', epsg4326_ll);
    var epsg3857_ur = proj4('EPSG:3857', epsg4326_ur);
    var url = 'http://mapventure.iarc.uaf.edu:8080/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=geonode%3Abarrow_sea_ice_radar&tiled=true&WIDTH=1100&HEIGHT=1100&CRS=EPSG%3A3857&STYLES=&BBOX=' + epsg3857_ll[0] + ',' + epsg3857_ll[1] + ',' + epsg3857_ur[0] + ',' + epsg3857_ur[1];
    var overlayPath;

    var deviceReadyPromise = new Promise(function(resolve, reject){
        document.addEventListener("deviceready", resolve, false);
    });

    var mapLoadPromise = new Promise(function(resolve, reject){
        $scope.$on('maploaded', resolve);
    });

    Promise.all([deviceReadyPromise, mapLoadPromise]).then(function(){
      var ft = new FileTransfer();

      $scope.redownload = function() {
        delete $scope.map.layers.overlays.seaice;
        window.resolveLocalFileSystemURL(overlayPath, function(entry) {
          entry.remove(downloadOverlay, function(error) {
            console.log('Error removing overlay file.');
            console.log(error);
          });
        });
      }

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        overlayPath = fileSystem.root.toURL() + 'overlay.png';
        window.resolveLocalFileSystemURL(overlayPath, function(entry) {
            addOverlay(entry.toURL());
          }, function() {
            downloadOverlay();
        });
      });

      function downloadOverlay() {
        ft.download(url, overlayPath, function(entry) {
          addOverlay(entry.toURL());
        }, function(error) {
          console.log('Download error: ' + error.source);
          console.log('Download error: ' + error.target);
          console.log('Download error: ' + error.code);
        })
      }

      function addOverlay(filePath) {
        $scope.map.layers.overlays = {
          seaice: {
            name: 'Sea Ice',
            type: 'imageOverlay',
            visible: true,
            url: filePath,
            bounds: [[epsg4326_ll[1], epsg4326_ll[0]], [epsg4326_ur[1], epsg4326_ur[0]]],
            layerParams: {
              showOnSelector: true,
              continuousWorld: true
            }
          }
        };
        $scope.$apply();
      }
    });

    $scope.$on("$stateChangeSuccess", function() {
      $scope.map = {
        defaults: {
          minZoom: 9,
          maxZoom: 13,
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
              url: 'images/bdl.png',
              bounds: [[epsg4326_ll[1], epsg4326_ll[0]], [epsg4326_ur[1], epsg4326_ur[0]]],
              layerParams: {
                showOnSelector: false,
                continuousWorld: true
              }
            },
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

      $scope.$emit('maploaded');
    });

    var Location = function() {
      if ( !(this instanceof Location) ) return new Location();
      this.lat  = "";
      this.lng  = "";
      this.name = "";
    };

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
        }, function(error) {
          console.log("Error getting GPS coordinates.");
          console.log(error);
        });
    };
  }
]);
