/*
|	File: dataparser.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: ARPAV Aria application data parser
|
*/

/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Parses JSON files and initializes the correct instances of our model objects

@class DataParser
@extends Backbone.Model
@constructor
**/
var DataParser = Backbone.Model.extend({

    /**
    Uses the given dataProvider to retrieve station data, properties and coordinates. Populates Centralina objects and creates our Airdata collection

    @method parseAll
	@param 	dataProvider	an instance of DataProvider
    @return {void}
    **/
    parseAll: function(dataProvider) {
        AA.airdata = new Airdata();
        AA.province = new Province();

        $.ajaxSetup({
            "error": function() {
                AA.modalHelper.hideLoading();
                AA.modalHelper.showError(0);
            }
        });

        $.getJSON(dataProvider.getData(), function(data) {
            $(data.stazioni).each(function(i, stat) {
                var station = new Centralina({
                    codseqst: stat.codseqst
                });
                var o3 = new Misure();
                var pm10 = new Misure();
                $(stat.misurazioni).each(function(k, mis) {
                    if (mis.ozono) {
                        $(mis.ozono).each(function(o, i) {
                            o3.add(new O3({
                                date: i.data,
                                sample: parseFloat(i.mis).toFixed(0),
                            }));
                        });
                        station.set({
                            mis_o3: o3
                        });
                        if (o3.lenght !== 0) {
                            station.set('nodata', 0);
                        }
                    }
                    if (mis.pm10) {
                        $(mis.pm10).each(function(o, i) {
                            pm10.add(new PM10({
                                date: i.data,
                                sample: parseFloat(i.mis).toFixed(0),
                            }));
                        });
                        station.set({
                            mis_pm10: pm10
                        });
                        if (pm10.lenght !== 0) {
                            station.set('nodata', 0);
                        }
                    }
                });
                AA.airdata.add(station);
            });
            $.getJSON(dataProvider.getStations(), function(data) {
                $(data.stazioni).each(function(i, stat) {
                    var match = AA.airdata.findWhere({
                        codseqst: stat.codseqst
                    });
                    if ( !! match) {
                        match.set({
                            nome: stat.nome,
                            localita: stat.localita,
                            citta: stat.comune,
                            provincia: stat.provincia,
                            tipologia: stat.tipozona
                        });
                        match.set('tipologia', match.formatTipologia());

                        var match2 = AA.province.findWhere({
                            nome: stat.provincia
                        });
                        if (!match2) {
                            var provincia = new Provincia({
                                nome: stat.provincia
                            });
                            AA.province.add(provincia);
                        }
                    }
                });
            });
            $.getJSON(dataProvider.getCoords(), function(data) {
                $(data.coordinate).each(function(i, stat) {
                    var match = AA.airdata.findWhere({
                        codseqst: stat.codseqst
                    });
                    if ( !! match) {
                        match.set({
                            lat: stat.lat,
                            lon: stat.lon
                        });
                    }
                });
                AA.dataParser.trigger('coordsReady');
                AA.modalHelper.hideLoading();
            });
        });
    },

    /**
    Uses the given dataProvider to retrieve validated data URL, retrieves it with an AJAX call and populates a CopTable object, setting it to its station

    @method parseCop
	@param 	xmlData		the URL of the XML to be parsed
	@param	id	The station whose validated data are to be parsed
    @return {void}
    **/
    parseCop: function(xmlData, id) {

        $.ajaxSetup({
            "error": function() {
                AA.modalHelper.hideLoading();
                AA.modalHelper.showError(1);
            }
        });

        $.ajax({
            type: "GET",
            url: xmlData,
            dataType: "xml",
            success: function(xml) {
                var entry = $(xml).find("row").filter(function() {
                    return $(this).find('CODSEQST').text() == id;
                });
                var stat = AA.airdata.findWhere({
                    codseqst: id
                });
                var copdata = new CopTable({
                    conc_no2: entry.find('CONC_NO2').text(),
                    ora_no2: entry.find('ORA_NO2').text(),
                    sup_no2: entry.find('SUP_NO2').text(),
                    conc_pm10: entry.find('CONC_PM10').text(),
                    sup_pm10: entry.find('SUP_PM10').text(),
                    conc_o3: entry.find('CONC_O3').text(),
                    ora_o3: entry.find('ORA_O3').text(),
                    conc_mm_o3: entry.find('CONC_MM_O3').text(),
                    sup_mm_o3: entry.find('SUP_MM_O3').text(),
                    conc_so2: entry.find('CONC_SO2').text(),
                    ora_so2: entry.find('ORA_SO2').text(),
                    sup_so2: entry.find('SUP_SO2').text(),
                    conc_mm_co: entry.find('CONC_MM_CO').text(),
                    sup_mm_co: entry.find('SUP_MM_CO').text(),
                    data: entry.find('DATA_BOLLETTINO').text(),
                    data_rif: entry.find('DATA_RIF').text(),
                    nome: entry.find('STATNM').text(),
                });
                stat.set('copdata', copdata);
                AA.dataParser.trigger('copReady', copdata);
            }
        });
    },

});
