barrow-sea-ice-app
==================

# Installation

Ensure that Ionic CLI is installed, then run the following commands:

```sh
ionic start myMapDemo https://github.com/ua-snap/barrow-sea-ice-app
cd myMapDemo
cordova plugin add cordova-plugin-geolocation cordova-plugin-file-transfer
bower install proj4leaflet angular-leaflet-directive
ionic platform add android
ionic serve
```

Ionic's ios platform has been omitted from these instructions since this app has so far only been tested on Android devices.

# Credits
This app was forked from Justin Noel's [Ionic Leaflet demo](https://github.com/calendee/ionic-leafletjs-map-demo).

## LICENSE

barrow-sea-ice-app is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository. Please review included libraries for license information specific to those projects.