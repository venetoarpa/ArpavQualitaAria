/*
|	File: geohelper.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-27
|
|	Brief: Geolocation helper prototype
|
*/

/**
Provides the application a data model

@module model
**/



/**
Geolocation helper. Holds default coordinates set in the middle of Veneto, and tries to localize the user.

@class GeoHelper
@extends Backbone.Model
@constructor
**/
var GeoHelper = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            venetoSOlat: 44.89,
            venetoSOlon: 10.62,
            venetoNElat: 46.68,
            venetoNElon: 13.23,
            lat: 45.45,
            lon: 11.55,
            isGeoLocalized: 0,
            closestOzone: 0,
            closestOzoneName: '',
            closestOzoneCod: '',
            closestOzoneDist: 0,
            closestOzoneDate: '',
            closestPM10: 0,
            closestPM10Name: '',
            closestPM10Cod: '',
            closestPM10Dist: 0,
            closestPM10Date: '',
        };
    },

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        //Whenever the coordinates are ready (downloaded, parsed and loaded into our models)
        //We call closestOzone and closestPM10 methods. They both need coordinates, thus they should be called only when there are actual coordinates
        this.listenTo(AA.dataParser, 'coordsReady', this.closestOzone);
        this.listenTo(AA.dataParser, 'coordsReady', this.closestPM10);
    },

    /**
    Tries to geolocalize the user thanks to the HTML5 Geolocation API.
	If it succeeds, it updates class data (and whoever is listening to this class gets notified, as usual) and tries to find closest ozone and pm10, as well as updating the user marker position.
	Errors get logged to the console but nothing else happens, as geolocation is a best-effort function.
	The first call uses low precision methods, the second call tries to use high-precision methods if the devices has any.

    @method geoLocalize
    @return {void}
    **/
    geoLocalize: function(start) {
        navigator.geolocation.getCurrentPosition(function(position) {
                AA.geoHelper.set('isGeoLocalized', 1);
                AA.geoHelper.set('lat', position.coords.latitude);
                AA.geoHelper.set('lon', position.coords.longitude);
                AA.geoHelper.closestOzone();
                AA.geoHelper.closestPM10();
                AA.controller.userMarker();
            },
            function(error) {
                console.log(error);
            });

        navigator.geolocation.getCurrentPosition(function(position) {
                AA.geoHelper.set('isGeoLocalized', 1);
                AA.geoHelper.set('lat', position.coords.latitude);
                AA.geoHelper.set('lon', position.coords.longitude);
                AA.geoHelper.closestOzone();
                AA.geoHelper.closestPM10();
                AA.controller.userMarker();
            },
            function(error) {
                console.log(error);
            }, {
                enableHighAccuracy: true
            });
    },

    /**
    Tries to find the ozone station that's closest to the user, if his position is known.
	If it succeeds, it should update this class attributes with the updated values. We are interested in the station's name, distance to the user, code and to its last ozone measure and date.

    @method closestOzone
    @return {void}
    **/
    closestOzone: function() {
        if (AA.geoHelper.get('isGeoLocalized') === 1) {
            var closestDistance = Number.MAX_VALUE;
            var position = new L.LatLng(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));
            _(AA.airdata.filter(function(centralina) {
                return centralina.get('mis_o3').length !== 0;
            })).each(function(centralina) {
                if (centralina.get('lat') !== 0 && centralina.get('lon') !== 0) {
                    var distance = position.distanceTo(new L.LatLng(centralina.get('lat'), centralina.get('lon')));
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        AA.geoHelper.set('closestOzone', centralina.get('mis_o3').last().get('sample'));
                        AA.geoHelper.set('closestOzoneName', centralina.get('nome'));
                        AA.geoHelper.set('closestOzoneCod', centralina.get('codseqst'));
                        AA.geoHelper.set('closestOzoneDist', distance);
                        var d = new Date(centralina.get('mis_o3').last().get('date').replace(/ /, 'T'));
                        var date = d.getDate() + '/' + (parseInt(d.getMonth(), null) + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':00';
                        AA.geoHelper.set('closestOzoneDate', date);
                    }
                }
            });
        }
    },

    /**
    Tries to find the PM10 station that's closest to the user, if his position is known.
	If it succeeds, it should update this class attributes with the updated values. We are interested in the station's name, distance to the user, code and to its last PM10 measure and date.

    @method closestPM10
    @return {void}
    **/
    closestPM10: function() {
        if (AA.geoHelper.get('isGeoLocalized') === 1) {
            var closestDistance = Number.MAX_VALUE;
            var position = new L.LatLng(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));
            _(AA.airdata.filter(function(centralina) {
                return centralina.get('mis_pm10').length !== 0;
            })).each(function(centralina) {
                if (centralina.get('lat') !== 0 && centralina.get('lon') !== 0) {
                    var distance = position.distanceTo(new L.LatLng(centralina.get('lat'), centralina.get('lon')));
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        AA.geoHelper.set('closestPM10', centralina.get('mis_pm10').last().get('sample'));
                        AA.geoHelper.set('closestPM10Name', centralina.get('nome'));
                        AA.geoHelper.set('closestPM10Cod', centralina.get('codseqst'));
                        AA.geoHelper.set('closestPM10Dist', distance);
                        var d = new Date(centralina.get('mis_pm10').last().get('date').replace(/ /, 'T'));
                        var date = d.getDate() + '/' + (parseInt(d.getMonth(), null) + 1) + '/' + d.getFullYear();
                        AA.geoHelper.set('closestPM10Date', date);
                    }
                }
            });
        }
    },




});
