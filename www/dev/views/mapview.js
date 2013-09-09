/*
|	File: mapview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-22
|
|	Brief: Map view manager
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Map view manager. Displays an interactive map from OpenStreetMaps 

@class MapView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var MapView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        this.listenTo(AA.geoHelper, "change", AA.controller.userMarker);
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Mappa', {
            'show': 1,
            'icon': 'icon-screenshot',
            'id': 'top_geoloc_map',
            'text': 'Mia pos.'
        });
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#map-tpl",

});
