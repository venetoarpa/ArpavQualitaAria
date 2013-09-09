/*
|	File: mainview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-22
|
|	Brief: Main view manager file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Main View manager. Renders our MainView template and manages user interaction

@class MainView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var MainView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        AA.controller.printHead(null, "Qualità Aria", null, 1);
        this.listenTo(AA.geoHelper, "change", this.render);
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#main_test",

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
        "click #maplink": "map",
        "click #listlink": "list",
        "click #settingslink": "settings",
        "click #closestOzone": "closestOzone",
        "click #closestPM10": "closestPM10",
    },

    /**
    Navigates the application to the "map" state

    @method map
    @return {void}
    **/
    map: function() {
        AA.router.navigate("map", {
            trigger: true
        });
    },

    /**
    Navigates the application to the "list" state

    @method list
    @return {void}
    **/
    list: function() {
        AA.router.navigate("list", {
            trigger: true
        });
    },

    /**
    Navigates the application to the "settings" state

    @method settings
    @return {void}
    **/
    settings: function() {
        AA.router.navigate("settings", {
            trigger: true
        });
    },

    /**
    Navigates the application to the data view of the station marked as the closest one monitoring ozone

    @method closestOzone
    @return {void}
    **/
    closestOzone: function() {
        AA.router.navigate("station/" + this.model.get('closestOzoneCod'), {
            trigger: true
        });
    },

    /**
    Navigates the application to the data view of the station marked as the closest one monitoring PM10

    @method closestPM10
    @return {void}
    **/
    closestPM10: function() {
        AA.router.navigate("station/" + this.model.get('closestPM10Cod'), {
            trigger: true
        });
    },

});
