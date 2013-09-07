/*
|	File: misurazione.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-16
|
|	Brief: Misurazione prototype file
|
*/

/**
Provides the base measure class

@module airdata
@submodule measures
**/



/**
Base measure class, to be extended by actual measures

@class Misurazione
@extends Backbone.Model
@constructor
**/
var Misurazione = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            date: '',
            sample: '0'
        };
    }

});
