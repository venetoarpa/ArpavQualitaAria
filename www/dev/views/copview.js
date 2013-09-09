/*
|	File: copview.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-02
|
|	Brief COP Table View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Renders the given COP table entry

@class Copview
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CopView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        var topView = AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Dati validati');
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#coptable",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'div',

});
