/*
|	File: maphelper.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: Map helper prototype
|
*/

/**
Provides the application a data model

@module model
**/



/**
Map helper. Works as an adapter between our application and the Leaflet OpenStreetMap API.
This way, we can define a set of map-provider-agnostic functions, and help isolation of the external API.

This should be treated as an interface! Every change on the function signatures has repercussions on the whole system

@class MapHelper
@extends Backbone.Model
@constructor
**/
var MapHelper = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            userMarker: null,
        };
    },

    /**
    Sets up the map, constraining it into the box described by the corners coordinates

    @method setupMap
	@param	SOlat	the south-west Veneto corner latitude
	@param	SOlon	the south-west Veneto corner longitude
	@param	NElat	the north-east Veneto corner latitude
	@param	NElon	the north-west Veneto corner longitude
    @return {void}
    **/
    setupMap: function(SOlat, SOlon, NElat, NElon) {
        var map;
        var ajaxRequest;
        var plotlist;
        var plotlayers = [];

        $('#map').height($(window).height() - $('#topnav').height() + "px");

        // set up the map

        //44.89, 10.62
        //46.68, 13.23
        map = new L.Map('map', {
            maxBounds: new L.LatLngBounds(new L.LatLng(SOlat, SOlon), new L.LatLng(NElat, NElon)),
        });

        // create the tile layer with correct attribution
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © OpenStreetMap contributors';
        var osm = new L.TileLayer(osmUrl, {
            minZoom: 8,
            maxZoom: 15,
            attribution: osmAttrib
        });

        map.addLayer(osm);
        AA.map = map;
    },

    /**
    Sets the map viewport center at the given latitude and longitude

    @method setView
	@param	lat	the desired center latitude
	@param	lon	the desired center longitude
    @return {void}
    **/
    setView: function(lat, lon) {
        AA.map.setView(new L.LatLng(lat, lon), 10);
    },

    /**
    Creates a standard marker (the blue one if using Leaflet) on the given map point, optionally binding to it a popup.
	The popup should be valid HTML content, and will appear when clicking the marker

    @method stdMrker
	@param	lat	the desired marker latitude
	@param	lon	the desired marker longitude
	@param	popup	HTML content to be treated as a marker popup
    @return {void}
    **/
    stdMarker: function(lat, lon, popup) {
        var marker = L.marker([lat, lon]).addTo(AA.map);
        if (popup !== null) {
            marker.bindPopup(popup);
        }
    },

    /**
    Creates a user marker (defined by the image URL used) on the given map point.

    @method userMarker
	@param	lat	the desired marker latitude
	@param	lon	the desired marker longitude
    @return {void}
    **/
    userMarker: function(lat, lon) {
        var marker = this.get('userMarker');
        if (marker === null) {
            var myIcon = L.icon({
                iconUrl: L.Icon.Default.imagePath + '/my_marker.png',
                iconRetinaUrl: L.Icon.Default.imagePath + '/my_marker-2x.png',
                iconSize: [25, 26]
            });
            marker = L.marker([lat, lon], {
                icon: myIcon,
                clickable: false
            });
            marker.addTo(AA.map);
            this.set('userMarker', marker);
        } else {
            marker.setLatLng(new L.LatLng(lat, lon));
        }
        AA.map.panTo(new L.LatLng(lat, lon));
    },


});
