/*
|	File: o3.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-16
|
|	Brief: O3 measure prototype file
|
*/

/**
Provides the base measure class

@module airdata
@submodule measures
**/

/**
Provides the prototype for our O3 sampling, as well as useful methods

@class O3
@extends Misurazione
@constructor
**/
var O3 = Misurazione.extend({

    /**
    Returns formatted date without minutes and seconds

    @method sample_date
    @return {String}
    **/
    sample_date: function() {
        var _date = this.get('date');
        // Given the date in the format YYYY-MM-DD HH:MI:SS we know we need chars between [0, 12]
        return _date.substr(0, 12);
    }


});
