/*
|	File: pm10.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-16
|
|	Brief: PM10 measure prototype file
|
*/

/**
Provides the base measure class

@module airdata
@submodule measures
**/

/**
Provides the prototype for our PM10 sampling, as well as useful methods

@class PM10
@extends Misurazione
@constructor
**/
var PM10 = Misurazione.extend({

    /**
    Returns formatted date without time information

    @method sample_date
    @return {String}
    **/
    sample_date: function() {
        var _date = this.get('date');
        // Given the date in the format YYYY-MM-DD HH:MI:SS we know we need chars between [0, 10]
        return _date.substr(0, 10);
    }


});
