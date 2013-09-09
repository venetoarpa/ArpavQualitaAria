/*
|	File: _centralinaitem.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-22
|
|	Brief: Centralina list item View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Centralina list item view. Renders a single row with relevant data from the station

@class CentralinaItem
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CentralinaItem = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#statlistel",

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
        "click .statlist_elem": "statdetails",
    },

    /**
    Navigates the application to the station data page

    @method statdetails
    @return {void}
    **/
    statdetails: function() {
        AA.router.navigate("station/" + this.model.get('codseqst'), {
            trigger: true
        });
    },

});
