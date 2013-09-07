/*
|	File: centralinapopupmap.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-29
|
|	Brief: Map popup manager
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Map popup manager. Creates popup content with station data

@class CentralinaPopupMap
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CentralinaPopupMap = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#statlistel",

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
