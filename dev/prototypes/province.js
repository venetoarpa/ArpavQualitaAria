/*
|	File: province.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-01
|
|	Brief: Province collection prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
Province collection prototype

@class Province
@Extends Backbone.Collection
@constructor
**/
var Province = Backbone.Collection.extend({

    /**
  Identifies the objects the collection will hold

  @property model
  @type Class
  @static
  @final
  **/
    model: Provincia,

});
