/*
|	File: ariarouter.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-23
|
|	Brief: ARPAV Aria application router
|
*/

/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Maps routes to actual controller actions, Methods should delegate operations to appropriate controller methods

@class AriaRouter
@extends Backbone.Router
@constructor
**/
var AriaRouter = Backbone.Router.extend({

    /**
	Available routes. These are the patterns Backbone will monitor whenever a new state is pushed on the navigation stack.
	It is, whenever some event or method calls navigate(url), checks the routes and, if there's a match, calls the router method.
	
	Should be a JSON object in the form
		"pattern" : "router_method_to_be_called"
		
	The method to be called should be a simple redirect to the correct Controller method, who will then instantiate the view

	@property routes
	@type Object
	**/
    routes: {
        "": "index",
        "map": "map",
        "list": "list",
        "settings": "settings",
        "stations/:provincia": "stations",
        "station/:number": "station",
        "cop/:provincia/:number": "cop"
    },

    /**
    Calls the controller Map method

    @method map
    @return {void}
    **/
    map: function() {
        AA.controller.map();
    },

    /**
    Calls the controller List method

    @method list
    @return {void}
    **/
    list: function() {
        AA.controller.list();
    },

    /**
    Calls the controller Index method

    @method index
    @return {void}
    **/
    index: function() {
        AA.controller.index();
    },

    /**
    Calls the controller Settings method

    @method map
    @return {void}
    **/
    settings: function() {
        AA.controller.settings();
    },

    /**
    Calls the controller Stations method

    @method stations
    @return {void}
    **/
    stations: function(id) {
        AA.controller.stations(id);
    },

    /**
    Calls the controller Station method

    @method station
    @return {void}
    **/
    station: function(id) {
        AA.controller.station(id);
    },

    /**
    Calls the controller Cop method

    @method cop
    @return {void}
    **/
    cop: function(provincia, id) {
        AA.controller.cop(id, provincia);
    }

});
