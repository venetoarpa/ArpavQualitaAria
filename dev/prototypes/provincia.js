/*
|	File: provincia.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-01
|
|	Brief: provincia model prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
Provincia model prototype

@class Provincia
@extends Backbone.Model
@constructor
**/
var Provincia = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            nome: '',
        };
    },

});
