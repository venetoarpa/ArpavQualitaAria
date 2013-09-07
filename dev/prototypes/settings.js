/*
|	File: settings.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-07-30
|
|	Brief: User settings prototype
|
*/

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
