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

/**
Provides the application a data model

@module model
**/



/**
Geolocation helper. Holds default coordinates set in the middle of Veneto, and tries to localize the user.

@class GeoHelper
@extends Backbone.Model
@constructor
**/
var GeoHelper = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            venetoSOlat: 44.89,
            venetoSOlon: 10.62,
            venetoNElat: 46.68,
            venetoNElon: 13.23,
            lat: 45.45,
            lon: 11.55,
            isGeoLocalized: 0,
            closestOzone: 0,
            closestOzoneName: '',
            closestOzoneCod: '',
            closestOzoneDist: 0,
            closestOzoneDate: '',
            closestPM10: 0,
            closestPM10Name: '',
            closestPM10Cod: '',
            closestPM10Dist: 0,
            closestPM10Date: '',
        };
    },

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        //Whenever the coordinates are ready (downloaded, parsed and loaded into our models)
        //We call closestOzone and closestPM10 methods. They both need coordinates, thus they should be called only when there are actual coordinates
        this.listenTo(AA.dataParser, 'coordsReady', this.closestOzone);
        this.listenTo(AA.dataParser, 'coordsReady', this.closestPM10);
    },

    /**
    Tries to geolocalize the user thanks to the HTML5 Geolocation API.
	If it succeeds, it updates class data (and whoever is listening to this class gets notified, as usual) and tries to find closest ozone and pm10, as well as updating the user marker position.
	Errors get logged to the console but nothing else happens, as geolocation is a best-effort function.
	The first call uses low precision methods, the second call tries to use high-precision methods if the devices has any.

    @method geoLocalize
    @return {void}
    **/
    geoLocalize: function(start) {
        navigator.geolocation.getCurrentPosition(function(position) {
                AA.geoHelper.set('isGeoLocalized', 1);
                AA.geoHelper.set('lat', position.coords.latitude);
                AA.geoHelper.set('lon', position.coords.longitude);
                AA.geoHelper.closestOzone();
                AA.geoHelper.closestPM10();
                AA.controller.userMarker();
            },
            function(error) {
                console.log(error);
            });

        navigator.geolocation.getCurrentPosition(function(position) {
                AA.geoHelper.set('isGeoLocalized', 1);
                AA.geoHelper.set('lat', position.coords.latitude);
                AA.geoHelper.set('lon', position.coords.longitude);
                AA.geoHelper.closestOzone();
                AA.geoHelper.closestPM10();
                AA.controller.userMarker();
            },
            function(error) {
                console.log(error);
            }, {
                enableHighAccuracy: true
            });
    },

    /**
    Tries to find the ozone station that's closest to the user, if his position is known.
	If it succeeds, it should update this class attributes with the updated values. We are interested in the station's name, distance to the user, code and to its last ozone measure and date.

    @method closestOzone
    @return {void}
    **/
    closestOzone: function() {
        if (AA.geoHelper.get('isGeoLocalized') === 1) {
            var closestDistance = Number.MAX_VALUE;
            var position = new L.LatLng(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));
            _(AA.airdata.filter(function(centralina) {
                return centralina.get('mis_o3').length !== 0;
            })).each(function(centralina) {
                if (centralina.get('lat') !== 0 && centralina.get('lon') !== 0) {
                    var distance = position.distanceTo(new L.LatLng(centralina.get('lat'), centralina.get('lon')));
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        AA.geoHelper.set('closestOzone', centralina.get('mis_o3').last().get('sample'));
                        AA.geoHelper.set('closestOzoneName', centralina.get('nome'));
                        AA.geoHelper.set('closestOzoneCod', centralina.get('codseqst'));
                        AA.geoHelper.set('closestOzoneDist', distance);
                        var d = new Date(centralina.get('mis_o3').last().get('date').replace(/ /, 'T'));
                        var date = d.getDate() + '/' + (parseInt(d.getMonth(), null) + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':00';
                        AA.geoHelper.set('closestOzoneDate', date);
                    }
                }
            });
        }
    },

    /**
    Tries to find the PM10 station that's closest to the user, if his position is known.
	If it succeeds, it should update this class attributes with the updated values. We are interested in the station's name, distance to the user, code and to its last PM10 measure and date.

    @method closestPM10
    @return {void}
    **/
    closestPM10: function() {
        if (AA.geoHelper.get('isGeoLocalized') === 1) {
            var closestDistance = Number.MAX_VALUE;
            var position = new L.LatLng(AA.geoHelper.get('lat'), AA.geoHelper.get('lon'));
            _(AA.airdata.filter(function(centralina) {
                return centralina.get('mis_pm10').length !== 0;
            })).each(function(centralina) {
                if (centralina.get('lat') !== 0 && centralina.get('lon') !== 0) {
                    var distance = position.distanceTo(new L.LatLng(centralina.get('lat'), centralina.get('lon')));
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        AA.geoHelper.set('closestPM10', centralina.get('mis_pm10').last().get('sample'));
                        AA.geoHelper.set('closestPM10Name', centralina.get('nome'));
                        AA.geoHelper.set('closestPM10Cod', centralina.get('codseqst'));
                        AA.geoHelper.set('closestPM10Dist', distance);
                        var d = new Date(centralina.get('mis_pm10').last().get('date').replace(/ /, 'T'));
                        var date = d.getDate() + '/' + (parseInt(d.getMonth(), null) + 1) + '/' + d.getFullYear();
                        AA.geoHelper.set('closestPM10Date', date);
                    }
                }
            });
        }
    },




});

/**
Provides the application a data model

@module model
**/



/**
Map helper. Works as an adapter between our application and the Leaflet OpenStreetMap API.
This way, we can define a set of map-provider-agnostic functions, and help isolation of the external API.

This should be treated as an interface! Every change on the function signatures has repercussions on the whole system

@class MapHelper
@extends Backbone.Model
@constructor
**/
var MapHelper = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            userMarker: null,
        };
    },

    /**
    Sets up the map, constraining it into the box described by the corners coordinates

    @method setupMap
	@param	SOlat	the south-west Veneto corner latitude
	@param	SOlon	the south-west Veneto corner longitude
	@param	NElat	the north-east Veneto corner latitude
	@param	NElon	the north-west Veneto corner longitude
    @return {void}
    **/
    setupMap: function(SOlat, SOlon, NElat, NElon) {
        var map;
        var ajaxRequest;
        var plotlist;
        var plotlayers = [];

        $('#map').height($(window).height() - $('#topnav').height() + "px");

        // set up the map

        //44.89, 10.62
        //46.68, 13.23
        map = new L.Map('map', {
            maxBounds: new L.LatLngBounds(new L.LatLng(SOlat, SOlon), new L.LatLng(NElat, NElon)),
        });

        // create the tile layer with correct attribution
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © OpenStreetMap contributors';
        var osm = new L.TileLayer(osmUrl, {
            minZoom: 8,
            maxZoom: 15,
            attribution: osmAttrib
        });

        map.addLayer(osm);
        AA.map = map;
    },

    /**
    Sets the map viewport center at the given latitude and longitude

    @method setView
	@param	lat	the desired center latitude
	@param	lon	the desired center longitude
    @return {void}
    **/
    setView: function(lat, lon) {
        AA.map.setView(new L.LatLng(lat, lon), 10);
    },

    /**
    Creates a standard marker (the blue one if using Leaflet) on the given map point, optionally binding to it a popup.
	The popup should be valid HTML content, and will appear when clicking the marker

    @method stdMrker
	@param	lat	the desired marker latitude
	@param	lon	the desired marker longitude
	@param	popup	HTML content to be treated as a marker popup
    @return {void}
    **/
    stdMarker: function(lat, lon, popup) {
        var marker = L.marker([lat, lon]).addTo(AA.map);
        if (popup !== null) {
            marker.bindPopup(popup);
        }
    },

    /**
    Creates a user marker (defined by the image URL used) on the given map point.

    @method userMarker
	@param	lat	the desired marker latitude
	@param	lon	the desired marker longitude
    @return {void}
    **/
    userMarker: function(lat, lon) {
        var marker = this.get('userMarker');
        if (marker === null) {
            var myIcon = L.icon({
                iconUrl: L.Icon.Default.imagePath + '/my_marker.png',
                iconRetinaUrl: L.Icon.Default.imagePath + '/my_marker-2x.png',
                iconSize: [25, 26]
            });
            marker = L.marker([lat, lon], {
                icon: myIcon,
                clickable: false
            });
            marker.addTo(AA.map);
            this.set('userMarker', marker);
        } else {
            marker.setLatLng(new L.LatLng(lat, lon));
        }
        AA.map.panTo(new L.LatLng(lat, lon));
    },


});

/**
Provides the base measure class

@module airdata
@submodule measures
**/



/**
Base measure class, to be extended by actual measures

@class Misurazione
@extends Backbone.Model
@constructor
**/
var Misurazione = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            date: '',
            sample: '0'
        };
    }

});

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

/**
Provides the application a controller and view managers

@module controller
**/



/**
Mmodal dialog manager. Displays and hides our messages as a modal alert with no buttons

@class ModalHelper
@extends Backbone.Model
@constructor
**/
var ModalHelper = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            currentDialog: null,
        };
    },

    /**
    Shows the "loading data" dialog

    @method showLoading
    @return {void}
    **/
    showLoading: function() {
        $('#loadingmodal').modal('show');
    },

    /**
    Hides the "loading data" dialog

    @method hideLoading
    @return {void}
    **/
    hideLoading: function() {
        $('#loadingmodal').modal('hide');
    },

    /**
    Shows the "error" modal dialog. Shows the non-modal (can't be closed) version or the dismissable one, according to the parameter given.
	A dismissable value of 0 means the user can't close the dialog (Useful in case of blocking error, i.e. no internet connection)

    @method showError
	@param dismissable	whether the user can close the error dialog or not
    @return {void}
    **/
    showError: function(dismissable) {
        if (typeof dismissable === 'undefined' || dismissable === 0) {
            $('#errormodal').modal('show');
        } else {
            $('#errormodalclose').modal('show');
        }
    },

});

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

/**
Application model

@module model
**/



/**
Webapp page model. Holds data about the header, and if it has to show the logo banner.

@class Page
@extends Backbone.Model
@constructor
**/
var Page = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            left_show: 0,
            left_href: '',
            left_text: '',
            center: '',
            right_show: 0,
            right_href: '',
            right_text: '',
            top_show: 0,
        };
    },

});

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

/**
Provides the application air quality data

@module airdata
**/



/**
Provincia model prototype

@class Provincia
@extends Backbone.Model
@constructor
**/
var Provincia = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            nome: '',
        };
    },

});

/**
Provides the application a data model

@module model
**/



/**
User settings model. Saves user settings about our ozone warning system

@class Settings
@extends Backbone.Model
@constructor
**/
var Settings = Backbone.Model.extend({

    /**
    Initializes default values, to ensure basic data can be provided.
    Gets called everytime a new object is created

    @method defaults
    @return {void}
    **/
    defaults: function() {
        return {
            alert_status: this.isAlertActive(),
            saved_stations: this.getSavedStations()
        };
    },

    /**
    Checks and returns if the user has turned on the alert system

    @method isAlertActive
    @return bool	0 if alert is turned off, 1 otherwise
    **/
    isAlertActive: function() {
        var res = AA.storage.getItem("ozone_alert");
        if (res === null) {
            AA.storage.setItem("ozone_alert", 0);
            return 0;
        } else {
            return res;
        }
    },

    /**
    Sets and returns the given status to the alert system.

    @method setAlertActive
	@param	bool	0 if we want to turn off the alert system, 1 otherwise
    @return bool	0 if alert is turned off, 1 otherwise
    **/
    setAlertActive: function(bool) {
        AA.storage.setItem("ozone_alert", bool);
        AA.settings.set("alert_status", bool);
        return bool;
    },

    /**
    Retrieves and returns the stations that the user added to his favourites

    @method getSavedStations
    @return Object	a collection of station codes
    **/
    getSavedStations: function() {
        return JSON.parse(AA.storage.getItem("saved_stations"));
    },

    /**
    Checks and returns if the given station is a user favourite one

    @method isStationStarred
	@param	id	the id of the station we want to check
    @return bool	0 if the station is not favourite, 1 otherwise
    **/
    isStationStarred: function(id) {
        var found = 0;
        _.each(AA.settings.getSavedStations(), function(elem) {
            if (elem == id) {
                found = 1;
            }
        });
        return found;
    },

    /**
    Toggles the station's favourite status: if a station is starred, removes it from the list. If a station is not starred, adds it

    @method toggleStationAlert
    @return void
    **/
    toggleStationAlert: function(id) {
        AA.settings.setAlertActive(1);
        var stat_array = AA.settings.getSavedStations();
        if (!Array.isArray(stat_array)) {
            stat_array = [];
        }
        var pos = stat_array.indexOf(id);
        if (pos === -1) {
            stat_array.push(id);
        } else {
            stat_array.splice(pos, 1);
        }
        AA.storage.setItem("saved_stations", JSON.stringify(stat_array));
        AA.settings.set("saved_stations", stat_array);
    },


});
