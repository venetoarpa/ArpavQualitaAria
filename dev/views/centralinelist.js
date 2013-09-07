/*
|	File: centralinelist.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-22
|
|	Brief: Centraline List View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Centraline List view prototype. Renders the list of stations

@class CentralineList
@Extends Backbone.Marionette.CompositeView
@constructor
**/
var CentralineList = Backbone.Marionette.CompositeView.extend({

    /**
	Identifies the itemView used to render the items of the passed collection

	@property itemView
	@type Class
	@static
	@final
	**/
    itemView: CentralinaItem,

    /**
	Identifies the container where actual items will be rendered, in form of CSS/jQuery selector

	@property itemViewContainer
	@type String
	@static
	@final
	**/
    itemViewContainer: 'ul#centraline',

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: '#statlist',

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Stazioni');
    },

});
