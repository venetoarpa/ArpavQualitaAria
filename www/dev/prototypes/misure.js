/*
|	File: misure.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-16
|
|	Brief: Misure collection prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
Misure collection prototype

@class Misure
@Extends Backbone.Collection
@constructor
**/
var Misure = Backbone.Collection.extend({

    /**
  Identifies the objects the collection will hold

  @property model
  @type Class
  @static
  @final
  **/
    model: Misurazione,

});
