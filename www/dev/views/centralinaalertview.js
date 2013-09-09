/*
|	File: centralinaalertview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-02
|
|	Brief: Centralina alert View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Renders buttons to toggle the alert system for the given station.
Note that this does not inherit from the "magic" Marionette views, but from a bare backbone view, and has to provide a render method, and the latter has to be called explicitly.

@class CentralinaAlertView
@Extends Backbone.View
@constructor
**/
var CentralinaAlertView = Backbone.View.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {

        this.listenTo(this.model, "change", this.render);

        if (this.model.get('mis_o3').length !== 0) {
            this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
        }
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
        "click .toggle-ozone:not(.disabled)": "toggle_ozone"
    },

    /**
    Toggles the starred state from the station in the application settings, and updates the model

    @method toggle_ozone
    @return {void}
    **/
    toggle_ozone: function() {
        AA.settings.toggleStationAlert(this.model.get('codseqst'));
        this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#toggle-ozone",

    /**
    Renders the view of the given template onto the DOM, using the standard Backbone way to render templates

    @method render
    @return this	to notify caller views (if any) about the rendering
    **/
    render: function() {
        $('#ozono-starred').html(_.template($(this.template).html(), this.model.attributes));
        return this;
    },

});
