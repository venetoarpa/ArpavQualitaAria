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

var app = {
    // Application Constructor
    initialize: function() {
        //this.bindEvents();
		this.onDeviceReady();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		$("#splashscreen").height($(window).height());
		$("#splashscreen").delay(1500).fadeOut(500);
        AA.controller = new AppController();
		AA.controller.start();
    },

};
