/*! App ARPAV Aria - v1.0.0 - 2013-09-07
* arpa.veneto.it
* Copyright (c) 2013 Daniele Lain - <daniele_lain@libero.it>;
	This program is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by 
	the Free Software Foundation, either version 3 of the License, or 
	(at your option) any later version. 
 
	This program is distributed in the hope that it will be useful, 
	but WITHOUT ANY WARRANTY; without even the implied warranty of 
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
	GNU General Public License for more details. 
  
	You should have received a copy of the GNU General Public License 
	along with this program.  If not, see <http://www.gnu.org/licenses/>. */
/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Provides an entry point to the application, as well as managing the retrieval of remote data and the correct dispatching of views

@class AppController
@extends Backbone.Model
@constructor
**/
var AppController = Backbone.Model.extend({

    /**
    Method to be run when the application first starts. 
	It initializes our global (singleton-like) classes:
		- ModalHelper (used to display error and loading messages)
		- DataProvider and DataParser to retrieve data
		- The Router used to manage navigation between views
		- Settings and LocalStorage, to manage user settings
		- GeoHelper and MapHelper, adapters to the geolocation API and Leaflet API
	And loads the main view.

    @method start
    @return {void}
    **/
    start: function() {
        AA.modalHelper = new ModalHelper();

        AA.modalHelper.showLoading();

        AA.dataProvider = new DataProvider();
        AA.dataParser = new DataParser();

        AA.dataParser.parseAll(AA.dataProvider);

        AA.app = new Backbone.Marionette.Application();
        AA.app.addRegions({
            navRegion: "#topnav",
            contentRegion: "#content"
        });
        AA.app.contentRegion.on("show", function(view) {
            window.scrollTo(0, 0);
        });

        AA.storage = window.localStorage;
        AA.settings = new Settings();

        AA.geoHelper = new GeoHelper();
        AA.geoHelper.geoLocalize(1);

        AA.mapHelper = new MapHelper();


        // var previousOrientation = window.orientation;
        // var checkOrientation = function() {
        // if (window.orientation !== previousOrientation) {
        // previousOrientation = window.orientation;
        // $('#topnav').width(parseInt($('#content').width(), null) + 10 + 'px');
        // }
        // };
        //window.addEventListener("resize", window.setTimeout(checkOrientation, 500), false);
        //window.addEventListener("orientationchange", window.setTimeout(checkOrientation, 500), false);

        // setInterval(checkOrientation, 1000);


        AA.router = new AriaRouter();
        Backbone.history.start({
            pushState: true,
            hashChange: false,
            root: "/arpav/"
        });
        this.index();
    },

    /**
    Method used to print the page head, with navigation icons and page title. Creates and loads an instance of the TopView object

    @method printHead
    @return {void}
    **/
    printHead: function(lt, ct, rt, lg) {
        lt = lt ? lt : {
            show: 0,
            icon: '',
            id: '',
            text: ''
        };
        rt = rt ? rt : {
            show: 0,
            icon: '',
            id: '',
            text: ''
        };
        var page = new Page({
            left_show: lt.show ? lt.show : 0,
            left_icon: lt.icon ? lt.icon : '',
            left_id: lt.id ? lt.id : '',
            left_text: lt.text ? lt.text : '',
            center: ct ? ct : '',
            right_show: rt.show ? rt.show : 0,
            right_icon: rt.icon ? rt.icon : '',
            right_id: rt.id ? rt.id : '',
            right_text: rt.text ? rt.text : '',
            logo_show: lg ? lg : 0,
        });
        var topView = new TopView({
            model: page
        });
        AA.app.navRegion.show(topView);
        return topView;
    },

    /**
    Loads our Map view. Ensures an active internet connection exists, and raises an error otherwise.
	Calls utility methods of the controller to create the OpenStreetMap map, and to draw markers on the map.

    @method map
    @return {void}
    **/
    map: function() {

        if (typeof navigator.connection !== 'undefined') {
            if (navigator.connection.type !== Connection.NONE) {
                var mapView = new MapView();
                AA.app.contentRegion.show(mapView);
                this.openStreetMap();
                this.centralineMarker();
                this.userMarker();
            } else {
                AA.modalHelper.showError(1);
            }
        } else { //This is only to make it work on browsers :(
            var mapView2 = new MapView();
            AA.app.contentRegion.show(mapView2);
            this.openStreetMap();
            this.centralineMarker();
            this.userMarker();
        }
    },

    /**
    Loads the Province List view

    @method list
    @return {void}
    **/
    list: function() {
        var listView = new ProvinceList({
            collection: AA.province
        });
        AA.app.contentRegion.show(listView);
    },

    /**
    Loads the Main view

    @method index
    @return {void}
    **/
    index: function() {
        var mainView = new MainView({
            model: AA.geoHelper
        });
        AA.app.contentRegion.show(mainView);
    },

    /**
    Loads the Stations list view

    @method stations
	@param 	id	the ID of the province whom stations we want to display
    @return {void}
    **/
    stations: function(id) {
        var provinciaCollection = new Airdata(AA.airdata.where({
            provincia: id
        }));
        var listView = new CentralineList({
            collection: provinciaCollection
        });
        AA.app.contentRegion.show(listView);
    },

    /**
    Loads the details page for a single station. Finds the station and creates the view, as well as calling utility methods to plot data and to call the Is-This-Starred view

    @method station
	@param 	id	the ID of the station we want to display
    @return {void}
    **/
    station: function(id) {
        var stat = AA.airdata.findWhere({
            codseqst: id
        });
        var centralinaView = new CentralinaView({
            model: stat
        });
        AA.app.contentRegion.show(centralinaView);
        centralinaView.plotOzono();
        centralinaView.plotPM10();
        var ozonoToggler = new CentralinaAlertView({
            el: '#ozono-starred',
            model: stat
        });
        ozonoToggler.render();
    },

    /**
    Loads the validated data table of the given station. If there's no cached data, has to remotely retrieve the XML file holding the data.
	When the data has been loaded, calls the copReady method, who will then create the View.

    @method cop
	@param 	id	the ID of the station we want to display
	@param	provincia	the name of the province
    @return {void}
    **/
    cop: function(id, provincia) {
        AA.modalHelper.showLoading();
        var stat = AA.airdata.findWhere({
            codseqst: id
        });
        var copdata = stat.get('copdata');
        if (copdata === null) {
            copdata = new CopTable(AA.dataParser.parseCop(AA.dataProvider.getCopData(provincia), id));
            AA.dataParser.on('copReady', this.copReady, this);
        } else {
            this.copReady(copdata);
        }
    },

    /**
    Loads the validated data table view, with the data retrieved from the cop method

    @method copReady
	@param 	model	the validated data of the station
    @return {void}
    **/
    copReady: function(model) {
        var copView = new CopView({
            model: model
        });
        AA.app.contentRegion.show(copView);
        AA.modalHelper.hideLoading();
    },

    /**
    Loads the settings view. Currently it's used as a Bookmark page, but will be improved when the push-notification component will be finished

    @method settings
    @return {void}
    **/
    settings: function() {
        var settingsView = new SettingsView({
            model: AA.settings
        });
        AA.app.contentRegion.show(settingsView);
        $('.btn-group').button();
    },

    /**
    Sets up the OpenStreetMap map, calling our adapter methods.
	Beside the name of this method, this makes the application independent from the actual map provider, as MapHelper provides an interface and encapsulates and hides provider-specific code.

    @method openStreetMap
    @return {void}
    **/
    openStreetMap: function() {
        AA.mapHelper.setupMap(AA.geoHelper.get('venetoSOlat'), AA.geoHelper.get('venetoSOlon'), AA.geoHelper.get('venetoNElat'), AA.geoHelper.get('venetoNElon'));
        AA.mapHelper.setView(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));

    },

    /**
    Sets up markers on the map representing the stations.
	This calls some adapter methods to encapsulate provider-specific code. The view that generates our popup is pure HTML (and thus implementation-independend) and can be binded to whatever map manager we are using

    @method centralineMarker
    @return {void}
    **/
    centralineMarker: function() {

        AA.airdata.each(function(ctrl) {
            var lat = ctrl.get('lat');
            var lon = ctrl.get('lon');

            var marker = L.marker([lat, lon]).addTo(AA.map);
            var centralinaPopupMap = new CentralinaPopupMap({
                model: ctrl
            });
            centralinaPopupMap.render();
            AA.mapHelper.stdMarker(lat, lon, centralinaPopupMap.el);
            marker.bindPopup(centralinaPopupMap.el);
        });
    },

    /**
    Sets up a special marker on the map based on the user's position, if any.

    @method userMarker
    @return {void}
    **/
    userMarker: function() {
        if (AA.geoHelper.get('isGeoLocalized') !== 0) {
            _.bindAll(AA.mapHelper, 'userMarker');
            AA.mapHelper.userMarker(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));
        }
    },


});

/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Maps routes to actual controller actions, Methods should delegate operations to appropriate controller methods

@class AriaRouter
@extends Backbone.Router
@constructor
**/
var AriaRouter = Backbone.Router.extend({

    /**
	Available routes. These are the patterns Backbone will monitor whenever a new state is pushed on the navigation stack.
	It is, whenever some event or method calls navigate(url), checks the routes and, if there's a match, calls the router method.
	
	Should be a JSON object in the form
		"pattern" : "router_method_to_be_called"
		
	The method to be called should be a simple redirect to the correct Controller method, who will then instantiate the view

	@property routes
	@type Object
	**/
    routes: {
        "": "index",
        "map": "map",
        "list": "list",
        "settings": "settings",
        "stations/:provincia": "stations",
        "station/:number": "station",
        "cop/:provincia/:number": "cop"
    },

    /**
    Calls the controller Map method

    @method map
    @return {void}
    **/
    map: function() {
        AA.controller.map();
    },

    /**
    Calls the controller List method

    @method list
    @return {void}
    **/
    list: function() {
        AA.controller.list();
    },

    /**
    Calls the controller Index method

    @method index
    @return {void}
    **/
    index: function() {
        AA.controller.index();
    },

    /**
    Calls the controller Settings method

    @method map
    @return {void}
    **/
    settings: function() {
        AA.controller.settings();
    },

    /**
    Calls the controller Stations method

    @method stations
    @return {void}
    **/
    stations: function(id) {
        AA.controller.stations(id);
    },

    /**
    Calls the controller Station method

    @method station
    @return {void}
    **/
    station: function(id) {
        AA.controller.station(id);
    },

    /**
    Calls the controller Cop method

    @method cop
    @return {void}
    **/
    cop: function(provincia, id) {
        AA.controller.cop(id, provincia);
    }

});

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

/**
Provides the app a controller and classes to manage the remote data source and its parsing

@module controller
**/



/**
Returns correct URLs pointing to the updated data.
Should STRICTLY adhere to this interface, with modifications having repercussions on the DataParser class.

@class DataProvider
@extends Backbone.Model
@constructor
**/
var DataProvider = Backbone.Model.extend({

    /**
    URL to the air quality data

    @method getData
    @return URL to the air quality data JSON file
    **/
    getData: function() {
        return "http://89.96.234.233/aria-json/exported/aria/data.json";
    },

    /**
    URL to the stations' data

    @method getStations
    @return URL to the stations' data JSON file
    **/
    getStations: function() {
        return "http://89.96.234.233/aria-json/exported/aria/stats.json";
    },

    /**
    URL to stations' coordinates

    @method getCoords
    @return URL to the coordinates JSON file
    **/
    getCoords: function() {
        return "http://89.96.234.233/aria-json/exported/aria/coords.json";
    },

    /**
    URL to the validated data XML file for a given province

    @method getData
	@param	provincia	Name of the province where the desired station is
    @return URL to the validated data XML file
    **/
    getCopData: function(provincia) {
        return "http://89.96.234.233/aria-json/exported/cop/" + provincia.toLowerCase() + ".xml";
    },

});
