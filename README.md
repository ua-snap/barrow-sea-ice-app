barrow-sea-ice-app
==================

# Installation

Ensure that Ionic CLI is installed, then run the following commands to download and set up the app:

```sh
ionic start myMapDemo https://github.com/ua-snap/barrow-sea-ice-app
cd myMapDemo
cordova plugin add cordova-plugin-geolocation cordova-plugin-file-transfer
bower install proj4leaflet angular-leaflet-directive
ionic platform add android
```

Note: Ionic's ios platform has been omitted from these instructions since this app has so far only been tested on Android devices.

To run the app on a device connected to your machine:

```sh
ionic run
```

To run the app in an emulator:

```sh
ionic emulate
```

# Development

When Ionic installs the app straight from the GitHub repo, it does not pull all the repo files down with it. Thus, while you will surely want to do development work on Ionic's copy of the files, you will need to clone the repo separately and copy your modificiations into it.

When the app is running on a real Android device connected to your machine, console output can be viewed via adb's logcat command like this:

```sh
adb logcat | grep INFO
```

The app can also be run in a browser. Some device dependent features will not work, but it's a good way to debug stylesheet issues or better interact with console output:

```sh
ionic serve
```

# Credits
This app was forked from Justin Noel's [Ionic Leaflet demo](https://github.com/calendee/ionic-leafletjs-map-demo).

## LICENSE

barrow-sea-ice-app is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository. Please review included libraries for license information specific to those projects.