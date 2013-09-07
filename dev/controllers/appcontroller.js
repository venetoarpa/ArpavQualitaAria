/*
|	File: appcontroller.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: ARPAV Aria application controller
|
*/

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
