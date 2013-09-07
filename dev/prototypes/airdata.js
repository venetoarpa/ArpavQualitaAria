/*
|	File: airdata.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-17
|
|	Brief: Airdata collection prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
Air data collection prototype. Will hold Centralina prototypes

@class Airdata
@extends Backbone.Collection
@constructor
**/
var Airdata = Backbone.Collection.extend({

    /**
  Identifies the objects the collection will hold

  @property model
  @type Class
  @static
  @final
  **/
    model: Centralina,

});
