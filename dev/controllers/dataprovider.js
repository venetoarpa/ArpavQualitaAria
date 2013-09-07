/*
|	File: dataprovider.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: ARPAV Aria application data provider
|
*/

/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Returns correct URLs pointing to the updated data.
Should STRICTLY adhere to this interface, with modifications having repercussions on the DataParser class.

@class DataProvider
@extends Backbone.Model
@constructor
**/
var DataProvider = Backbone.Model.extend({

    /**
    URL to the air quality data

    @method getData
    @return URL to the air quality data JSON file
    **/
    getData: function() {
        return "http://89.96.234.233/aria-json/exported/aria/data.json";
    },

    /**
    URL to the stations' data

    @method getStations
    @return URL to the stations' data JSON file
    **/
    getStations: function() {
        return "http://89.96.234.233/aria-json/exported/aria/stats.json";
    },

    /**
    URL to stations' coordinates

    @method getCoords
    @return URL to the coordinates JSON file
    **/
    getCoords: function() {
        return "http://89.96.234.233/aria-json/exported/aria/coords.json";
    },

    /**
    URL to the validated data XML file for a given province

    @method getData
	@param	provincia	Name of the province where the desired station is
    @return URL to the validated data XML file
    **/
    getCopData: function(provincia) {
        return "http://89.96.234.233/aria-json/exported/cop/" + provincia.toLowerCase() + ".xml";
    },

});
