/*
|	File: modalhelper.js
|	Author: Daniele Lain @ ARPA Veneto
|	Last modified: 2013-08-06
|
|	Brief: Modal dialog manager prototype file
|
*/

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
