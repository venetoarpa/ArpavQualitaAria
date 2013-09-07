/*
|	File: _provinciaitem.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-01
|
|	Brief: Provincia list item View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Provincia list item view. Renders a single row with relevant data from the province

@class ProvinciaItem
@Extends Backbone.Marionette.ItemView
@constructor
**/
var ProvinciaItem = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#provlistel",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'li',

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
        "click .statlist_elem": "provincia",
    },

    /**
    Navigates the application to the province data page, where all the station in the given province will be shown

    @method provincia
    @return {void}
    **/
    provincia: function() {
        AA.router.navigate("stations/" + this.model.get('nome'), {
            trigger: true
        });
    },

});
