/*
|	File: coptable.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-05
|
|	Brief: COP table model prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
COP table model prototype

@class CopTable
@extends Backbone.Model
@constructor
**/
var CopTable = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            conc_no2: '',
            ora_no2: '',
            sup_no2: '',
            conc_pm10: '',
            sup_pm10: '',
            conc_o3: '',
            ora_o3: '',
            conc_mm_o3: '',
            sup_mm_o3: '',
            conc_so2: '',
            ora_so2: '',
            sup_so2: '',
            conc_mm_co: '',
            sup_mm_co: '',
            data: '',
            data_rif: '',
            nome: '',
        };
    },

});
