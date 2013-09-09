/*
|	File: mapview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: Settings view manager
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Settings view manager, to show and edit stored user preferences

@class SettingsView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var SettingsView = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#opts-tpl",

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Preferiti');
    },

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
        "click #ozone_activate:not(.disabled)": "ozone_on",
        "click #ozone_deactivate:not(.disabled)": "ozone_off",
        "click .centralina": "centralina",
        "click .unsubscribe": "unsubscribe"
    },

    /**
    Calls the Settings method to turn on the Alert system

    @method ozone_on
    @return {void}
    **/
    ozone_on: function() {
        AA.settings.setAlertActive(1);
    },

    /**
    Calls the Settings method to turn off the Alert system

    @method ozone_off
    @return {void}
    **/
    ozone_off: function() {
        AA.settings.setAlertActive(0);
    },

    /**
    Navigates the application to the data view for the clicked station

    @method centralina
	@param	ev	gets automatically passed by Javascript, and holds information about the event that called this method
    @return {void}
    **/
    centralina: function(ev) {
        var id = $(ev.currentTarget).attr('id');
        AA.router.navigate("station/" + id, {
            trigger: true
        });
    },

    /**
    Removes the clicked station from the starred/favourite list

    @method unsubscribe
	@param	ev	gets automatically passed by Javascript, and holds information about the event that called this method
    @return {void}
    **/
    unsubscribe: function(ev) {
        ev.stopImmediatePropagation();
        var id = $(ev.currentTarget).closest("a").attr('id');
        AA.settings.toggleStationAlert(id);
    },

});
