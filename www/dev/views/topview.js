/*
|	File: topview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-02
|
|	Brief: Top view manager prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Top view manager. Renders a banner, the title and navigation controls

@class TopView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var TopView = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: '#top_page',

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click #top_back": "back",
        "click #top_geoloc_map": "geoloc_map",
        "click #top_cop": "cop",
    },

    /**
    Navigates the application back. This will be used by the simil-iPhone back button

    @method back
    @return {void}
    **/
    back: function() {
        window.history.back();
    },

    /**
    Asks the geolocation manager to geolocalize the user

    @method geoloc_map
    @return {void}
    **/
    geoloc_map: function() {
        AA.geoHelper.geoLocalize();
    },

    /**
    Triggers the COP event. 
	Anyone can listen to this event, currently the Controller listens it to start downloading validated data and then instantiate the view

    @method cop
    @return {void}
    **/
    cop: function() {
        this.trigger('cop');
    },

});
