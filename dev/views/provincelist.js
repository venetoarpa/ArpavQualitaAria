/*
|	File: provincelist.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-01
|
|	Brief: Province List View prototype file
|
*/

/**
Provides the application a controller and view managers

@module controller
**/



/**
Province List view prototype. Renders the list of provinces with at least one station.
This class renders the container of the list, and calls a given itemView for every element in the collection

@class CentralineList
@Extends Backbone.Marionette.CompositeView
@constructor
**/
var ProvinceList = Backbone.Marionette.CompositeView.extend({

    /**
	Identifies the itemView used to render the items of the passed collection

	@property itemView
	@type Class
	@static
	@final
	**/
    itemView: ProvinciaItem,

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
        }, 'Province');
    },

});
