/*
|	File: centralina.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-07
|
|	Brief: Centralina model prototype file
|
*/

/**
Provides the application air quality data

@module airdata
**/



/**
Centralina model prototype

@class Centralina
@extends Backbone.Model
@constructor
**/
var Centralina = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            codseqst: '',
            nome: '',
            statcd: '',
            netcd: '',
            localita: '',
            citta: '',
            provincia: '',
            tipologia: '',
            lat: 0,
            lon: 0,
            mis_o3: new Misure(),
            mis_pm10: new Misure(),
            copdata: null,
            nodata: 1,
        };
    },

    /**
    Formats the "tipologia" code of this station to a more user-friendly string

    @method formatTipologia
    @return {String} The type of the station
    **/
    formatTipologia: function() {
        switch (this.get('tipologia')) {
            case "TU":
                return "stazione di Traffico situata in zona Urbana";
            case "BU":
                return "stazione di Background situata in zona Urbana";
            case "BS":
                return "stazione di Background situata in zona Suburbana";
            case "BRU":
                return "stazione di Background situata in zona Rurale";
            case "IU":
                return "stazione Industriale situata in zona Urbana";
            case "IS":
                return "stazione Industriale situata in zona Suburbana";
            default:
                return this.get('tipologia');
        }
    },


});
