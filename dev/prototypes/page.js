/*
|	File: page.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-16
|
|	Brief: Webapp Page model
|
*/

/**
Application model

@module model
**/



/**
Webapp page model. Holds data about the header, and if it has to show the logo banner.

@class Page
@extends Backbone.Model
@constructor
**/
var Page = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            left_show: 0,
            left_href: '',
            left_text: '',
            center: '',
            right_show: 0,
            right_href: '',
            right_text: '',
            top_show: 0,
        };
    },

});
