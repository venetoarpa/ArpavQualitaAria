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
Provides the application a controller and view managers

@module controller
**/



/**
Centralina list item view. Renders a single row with relevant data from the station

@class CentralinaItem
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CentralinaItem = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#statlistel",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'li',

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click .statlist_elem": "statdetails",
    },

    /**
    Navigates the application to the station data page

    @method statdetails
    @return {void}
    **/
    statdetails: function() {
        AA.router.navigate("station/" + this.model.get('codseqst'), {
            trigger: true
        });
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Provincia list item view. Renders a single row with relevant data from the province

@class ProvinciaItem
@Extends Backbone.Marionette.ItemView
@constructor
**/
var ProvinciaItem = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#provlistel",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'li',

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click .statlist_elem": "provincia",
    },

    /**
    Navigates the application to the province data page, where all the station in the given province will be shown

    @method provincia
    @return {void}
    **/
    provincia: function() {
        AA.router.navigate("stations/" + this.model.get('nome'), {
            trigger: true
        });
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Renders buttons to toggle the alert system for the given station.
Note that this does not inherit from the "magic" Marionette views, but from a bare backbone view, and has to provide a render method, and the latter has to be called explicitly.

@class CentralinaAlertView
@Extends Backbone.View
@constructor
**/
var CentralinaAlertView = Backbone.View.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {

        this.listenTo(this.model, "change", this.render);

        if (this.model.get('mis_o3').length !== 0) {
            this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
        }
    },

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click .toggle-ozone:not(.disabled)": "toggle_ozone"
    },

    /**
    Toggles the starred state from the station in the application settings, and updates the model

    @method toggle_ozone
    @return {void}
    **/
    toggle_ozone: function() {
        AA.settings.toggleStationAlert(this.model.get('codseqst'));
        this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#toggle-ozone",

    /**
    Renders the view of the given template onto the DOM, using the standard Backbone way to render templates

    @method render
    @return this	to notify caller views (if any) about the rendering
    **/
    render: function() {
        $('#ozono-starred').html(_.template($(this.template).html(), this.model.attributes));
        return this;
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Map popup manager. Creates popup content with station data

@class CentralinaPopupMap
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CentralinaPopupMap = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#statlistel",

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click .statlist_elem": "statdetails",
    },

    /**
    Navigates the application to the station data page

    @method statdetails
    @return {void}
    **/
    statdetails: function() {
        AA.router.navigate("station/" + this.model.get('codseqst'), {
            trigger: true
        });
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Renders a page with details from the station and plotted data

@class CentralinaView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CentralinaView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        var topView = AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Dati');
        topView.on('cop', this.cop, this);

        // If the station monitors Ozone (there's some Ozone samples)
        if (this.model.get('mis_o3').length !== 0) {
            // We find the maximum using the Underscore max() method, and set it into the model, to display it later
            var maxo3 = this.model.get('mis_o3').max(function(sample) {
                return parseFloat(sample.get('sample'));
            });
            this.model.set('maxo3', maxo3);
        }

        // We do the same operations with our (eventual) PM10 samples
        if (this.model.get('mis_pm10').length !== 0) {
            var maxpm10 = this.model.get('mis_pm10').max(function(sample) {
                return parseFloat(sample.get('sample'));
            });
            this.model.set('maxpm10', maxpm10);
        }

        // We read from the settings if the station is starred and set it into the model
        this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
    },

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click .toggle-ozone:not(.disabled)": "toggle_ozone",
        "click .cop": "cop",
    },

    /**
    Toggles the starred state from the station in the application settings, and updates the model

    @method toggle_ozone
    @return {void}
    **/
    toggle_ozone: function() {
        AA.settings.toggleStationAlert(this.model.get('codseqst'));
        this.model.set('ozonoStarred', AA.settings.isStationStarred(this.model.get('codseqst')));
    },

    /**
    Navigates the application to the validated data page

    @method cop
    @return {void}
    **/
    cop: function() {
        AA.router.navigate("cop/" + this.model.get('provincia') + '/' + this.model.get('codseqst'), {
            trigger: true
        });
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#details",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'div',

    /**
    Utility method to find the starting date from a set of dates, and return it as a timestamp

    @method getStartDate
	@param	set	a set of dates in the format YYYY-MM-DD HH:MM:SS
    @return int	timestamp of the starting date from the set
    **/
    getStartDate: function(set) {
        var str = _.first(set).get('date');
        return Date.parse(str.replace(/ /, 'T'));
    },

    /**
    Utility method to create an array of samples from a set of PM10 or Ozone measure objects

    @method getValues
	@param	set	a set of objects adhering to the Misura interface
    @return Array	the array of numerical samples
    **/
    getValues: function(set) {
        var values = [];
        _.each(set, function(element) {
            if (element.get('sample') !== '' && element.get('sample') !== 'NaN') {
                values.push(parseFloat(element.get('sample')));
            } else {
                values.push(null);
            }
        });
        return values;
    },

    /**
    Plots the Ozone data graph. Has to check if ozone samples exist, and then calles the correct implementation based on the SVG implementation:
	- If <html> has the SVG class (appended by the feature detection library Modernizr) we can render the Highcharts.js chart
	- If <html> has no SVG class, we fallback to the Graph.js chart

    @method plotOzono
    @return {void}
    **/
    plotOzono: function() {

        if (this.model.get('mis_o3').length !== 0) {
            if ($('html').hasClass('svg')) {
                this.ozonoHighcharts();
            } else {
                this.ozonoChart();
            }
        }
    },

    /**
    Builds a Highcharts.js ozone chart, passing the needed options to the constructor

    @method ozonoHighcharts
    @return {void}
    **/
    ozonoHighcharts: function() {

        $('#ozono-canvas').remove();
        var startDate = this.getStartDate(this.model.get('mis_o3').models);

        var values = this.getValues(this.model.get('mis_o3').models);

        $('#ozono-hc').highcharts({
            chart: {
                type: 'line',
            },
            colors: [
                '#0d233a',
                '#8bbc21',
                '#910000',
                '#1aadce',
                '#492970',
                '#f28f43',
                '#77a1e5',
                '#c42525',
                '#a6c96a'
            ],
            xAxis: {
                type: 'datetime',
                minTickInterval: 12 * 3600 * 1000,
                dateTimeLabelFormats: {
                    millisecond: "%e/%m/%Y, %H:%M:%S.%L",
                    second: "%e/%m/%Y, %H:%M:%S",
                    minute: "%e/%m/%Y, %H:00",
                    hour: "%e/%m/%Y, %H:00",
                    day: "%e/%m/%Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%m %Y",
                    year: "%Y"
                }
            },
            yAxis: {
                min: 0,
                max: 320,
                tickInterval: 40,
                title: {
                    text: 'µg/m3'
                },
                plotBands: [{
                    from: 0,
                    to: 120,
                    color: '#BFFFFF'
                }, {
                    from: 120,
                    to: 180,
                    color: '#99FFFF'
                }, {
                    from: 180,
                    to: 240,
                    color: '#66D9FF'
                }, {
                    from: 240,
                    to: 300,
                    color: '#00B3FF'
                }],
                gridLineWidth: 0,
            },
            tooltip: {
                shared: true,
                valueSuffix: ' µg/m3',
                dateTimeLabelFormats: {
                    millisecond: "%e/%m/%Y, %H:%M:%S.%L",
                    second: "%e/%m/%Y, %H:%M:%S",
                    minute: "%e/%m/%Y, %H:00",
                    hour: "%e/%m/%Y, %H:00",
                    day: "%e/%m/%Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%m %Y",
                    year: "%Y"
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                line: {
                    pointStart: startDate,
                    pointInterval: 1000 * 3600
                }
            },
            series: [{
                name: 'Ozono',
                data: values
            }]
        });
    },

    /**
    Builds a Graph.js chart, passing the needed options to the constructor.
	has to do some pre-processing, to create an array of dates, because this is not automatic as in Highcharts

    @method ozonoChart
    @return {void}
    **/
    ozonoChart: function() {
        var startDate = this.getStartDate(this.model.get('mis_o3').models);
        var dates = [];
        //We want the dates[] array to be formatted this way:
        //	- 48 elements, as the 48 hours we have to display
        //		- The element can be empty ( '' ) if no label is to be displayed
        //		- The element can be a DD/MM HH:MM	string if a labes is to be displayed
        //	And we want labels to be displayed only on middays and midnights.
        var date = startDate;
        var now = Date.now();
        var count = 0;
        var oldDay = 0;
        while (date <= now && count < 48) {
            var dt = new Date(date);
            var day = dt.getDate();
            if (day != oldDay || dt.getHours() == '12') {
                dates.push(dt.getDate() + '/' + (parseInt(dt.getMonth(), null) + 1) + ' ' + dt.getHours() + ':' + dt.getMinutes());
                oldDay = day;
            } else {
                dates.push('');
            }
            date = date + 1000 * 3600;
            count = count + 1;
        }

        var values = this.getValues(this.model.get('mis_o3').models);

        // IMPORTANT! Stretch the canvas to the whole document width available, to avoid rendering a chart which is too little or too big
        $("#ozono-canvas").get(0).width = $(document).width();
        var ctx = $("#ozono-canvas").get(0).getContext("2d");

        new Chart(ctx).Line({
            labels: dates,
            datasets: [{
                fillColor: "rgba(220,220,220,0.0)",
                strokeColor: "rgba(13,35,58,1)",
                pointColor: "rgba(33,55,78,1)",
                pointStrokeColor: "#fff",
                data: values
            }]
        }, {
            bezierCurve: false,
            scaleShowLabels: true,
            scaleOverride: true,
            scaleSteps: 8,
            scaleStepWidth: 40,
            scaleStartValue: 0,
        });
    },

    /**
    Plots the PM10 data graph. Has to check if PM10 samples exist, and then calles the correct implementation based on the SVG implementation:
	- If <html> has the SVG class (appended by the feature detection library Modernizr) we can render the Highcharts.js chart
	- If <html> has no SVG class, we fallback to the Graph.js chart

    @method plotPM10
    @return {void}
    **/
    plotPM10: function() {

        if (this.model.get('mis_pm10').length !== 0) {
            if ($('html').hasClass('svg')) {
                this.PM10Highcharts();
            } else {
                this.PM10Chart();
            }

        }
    },

    /**
    Builds a Highcharts.js PM10 chart, passing the needed options to the constructor

    @method PM10Highcharts
    @return {void}
    **/
    PM10Highcharts: function() {

        $('#pm10-canvas').remove();

        var startDate = this.getStartDate(this.model.get('mis_pm10').models);
        var values = this.getValues(this.model.get('mis_pm10').models);

        $('#pm10-hc').highcharts({
            chart: {
                type: 'column'
            },
            colors: [
                '#910000',
                '#1aadce',
                '#492970',
                '#f28f43',
                '#77a1e5',
                '#c42525',
                '#a6c96a'
            ],
            xAxis: {
                type: 'datetime',
                minTickInterval: 24 * 3600 * 1000,
                dateTimeLabelFormats: {
                    millisecond: "%e/%m/%Y, %H:%M:%S.%L",
                    second: "%e/%m/%Y, %H:%M:%S",
                    minute: "%e/%m/%Y, %H:00",
                    hour: "%e/%m/%Y, %H:00",
                    day: "%e/%m/%Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%m %Y",
                    year: "%Y"
                }
            },
            yAxis: {
                min: 0,
                max: 250,
                tickInterval: 25,
                title: {
                    text: 'µg/m3'
                },
                plotBands: [{
                    from: 0,
                    to: 50,
                    color: '#99FFFF'
                }, {
                    from: 50,
                    to: 100,
                    color: '#66D9FF'
                }, {
                    from: 100,
                    to: 250,
                    color: '#00B3FF'
                }],
                gridLineWidth: 0,
            },
            tooltip: {
                shared: true,
                valueSuffix: ' µg/m3',
                dateTimeLabelFormats: {
                    millisecond: "%e/%m/%Y, %H:%M:%S.%L",
                    second: "%e/%m/%Y, %H:%M:%S",
                    minute: "%e/%m/%Y, %H:00",
                    hour: "%e/%m/%Y, %H:00",
                    day: "%e/%m/%Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%e %Y",
                    year: "%Y"
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    pointStart: startDate,
                    pointInterval: 1000 * 3600 * 24
                }
            },
            series: [{
                name: 'PM10',
                data: values
            }]
        });
    },

    /**
    Builds a Graph.js chart, passing the needed options to the constructor.
	has to do some pre-processing, to create an array of dates, because this is not automatic as in Highcharts

    @method ozonoChart
    @return {void}
    **/
    PM10Chart: function() {
        var startDate = this.getStartDate(this.model.get('mis_pm10').models);
        var dates = [];
        //We want the dates[] array to be formatted this way:
        //	- 7 elements, as the 7 hours we have to display
        //		- The element can be empty ( '' ) if no label is to be displayed
        //		- The element can be a DD/MM string if a labes is to be displayed
        //	And we want labels to be displayed only on the first, third, fifth and seventh day if the document is small in witdh, and everyday otherwise
        var date = startDate;
        var now = Date.now();
        var count = 0;
        while (date <= now && count < 7) {
            var dt = new Date(date);
            var day = dt.getDate();
            if ($(document).width() < 300) {
                if (count % 2 == 1) {
                    dates.push(dt.getDate() + '/' + (parseInt(dt.getMonth(), null) + 1));
                }
            } else {
                dates.push(dt.getDate() + '/' + (parseInt(dt.getMonth(), null) + 1));
            }
            date = date + 1000 * 3600 * 24;
            count = count + 1;
        }

        var values = this.getValues(this.model.get('mis_o3').models);

        // IMPORTANT! Stretch the canvas to the maximum available width BEFORE RENDERING ANYTHING
        $("#pm10-canvas").get(0).width = $(document).width();
        var ctx = $("#pm10-canvas").get(0).getContext("2d");

        new Chart(ctx).Bar({
            labels: dates,
            datasets: [{
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                data: values,
            }]
        }, {
            scaleShowLabels: true,
            scaleOverride: true,
            scaleSteps: 5,
            scaleStepWidth: 50,
            scaleStartValue: 0,
        });
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Centraline List view prototype. Renders the list of stations

@class CentralineList
@Extends Backbone.Marionette.CompositeView
@constructor
**/
var CentralineList = Backbone.Marionette.CompositeView.extend({

    /**
	Identifies the itemView used to render the items of the passed collection

	@property itemView
	@type Class
	@static
	@final
	**/
    itemView: CentralinaItem,

    /**
	Identifies the container where actual items will be rendered, in form of CSS/jQuery selector

	@property itemViewContainer
	@type String
	@static
	@final
	**/
    itemViewContainer: 'ul#centraline',

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: '#statlist',

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Stazioni');
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Renders the given COP table entry

@class Copview
@Extends Backbone.Marionette.ItemView
@constructor
**/
var CopView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        var topView = AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Dati validati');
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#coptable",

    /**
	Identifies the tag this view will use to render the element, in the form of CSS/jQuery selector

	@property tagName
	@type String
	@static
	@final
	**/
    tagName: 'div',

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Main View manager. Renders our MainView template and manages user interaction

@class MainView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var MainView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        AA.controller.printHead(null, "Qualità Aria", null, 1);
        this.listenTo(AA.geoHelper, "change", this.render);
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#main_test",

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click #maplink": "map",
        "click #listlink": "list",
        "click #settingslink": "settings",
        "click #closestOzone": "closestOzone",
        "click #closestPM10": "closestPM10",
    },

    /**
    Navigates the application to the "map" state

    @method map
    @return {void}
    **/
    map: function() {
        AA.router.navigate("map", {
            trigger: true
        });
    },

    /**
    Navigates the application to the "list" state

    @method list
    @return {void}
    **/
    list: function() {
        AA.router.navigate("list", {
            trigger: true
        });
    },

    /**
    Navigates the application to the "settings" state

    @method settings
    @return {void}
    **/
    settings: function() {
        AA.router.navigate("settings", {
            trigger: true
        });
    },

    /**
    Navigates the application to the data view of the station marked as the closest one monitoring ozone

    @method closestOzone
    @return {void}
    **/
    closestOzone: function() {
        AA.router.navigate("station/" + this.model.get('closestOzoneCod'), {
            trigger: true
        });
    },

    /**
    Navigates the application to the data view of the station marked as the closest one monitoring PM10

    @method closestPM10
    @return {void}
    **/
    closestPM10: function() {
        AA.router.navigate("station/" + this.model.get('closestPM10Cod'), {
            trigger: true
        });
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Map view manager. Displays an interactive map from OpenStreetMaps 

@class MapView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var MapView = Backbone.Marionette.ItemView.extend({

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        this.listenTo(AA.geoHelper, "change", AA.controller.userMarker);
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Mappa', {
            'show': 1,
            'icon': 'icon-screenshot',
            'id': 'top_geoloc_map',
            'text': 'Mia pos.'
        });
    },

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#map-tpl",

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Province List view prototype. Renders the list of provinces with at least one station.
This class renders the container of the list, and calls a given itemView for every element in the collection

@class CentralineList
@Extends Backbone.Marionette.CompositeView
@constructor
**/
var ProvinceList = Backbone.Marionette.CompositeView.extend({

    /**
	Identifies the itemView used to render the items of the passed collection

	@property itemView
	@type Class
	@static
	@final
	**/
    itemView: ProvinciaItem,

    /**
	Identifies the container where actual items will be rendered, in form of CSS/jQuery selector

	@property itemViewContainer
	@type String
	@static
	@final
	**/
    itemViewContainer: 'ul#centraline',

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: '#statlist',

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Province');
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Settings view manager, to show and edit stored user preferences

@class SettingsView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var SettingsView = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: "#opts-tpl",

    /**
    Method automatically called at every instantiation, to bind needed events and listeners

    @method initialize
    @return {void}
    **/
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        AA.controller.printHead({
            'show': 1,
            'icon': 'icon-chevron-left',
            'id': 'top_back',
            'text': 'Indietro'
        }, 'Preferiti');
    },

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click #ozone_activate:not(.disabled)": "ozone_on",
        "click #ozone_deactivate:not(.disabled)": "ozone_off",
        "click .centralina": "centralina",
        "click .unsubscribe": "unsubscribe"
    },

    /**
    Calls the Settings method to turn on the Alert system

    @method ozone_on
    @return {void}
    **/
    ozone_on: function() {
        AA.settings.setAlertActive(1);
    },

    /**
    Calls the Settings method to turn off the Alert system

    @method ozone_off
    @return {void}
    **/
    ozone_off: function() {
        AA.settings.setAlertActive(0);
    },

    /**
    Navigates the application to the data view for the clicked station

    @method centralina
	@param	ev	gets automatically passed by Javascript, and holds information about the event that called this method
    @return {void}
    **/
    centralina: function(ev) {
        var id = $(ev.currentTarget).attr('id');
        AA.router.navigate("station/" + id, {
            trigger: true
        });
    },

    /**
    Removes the clicked station from the starred/favourite list

    @method unsubscribe
	@param	ev	gets automatically passed by Javascript, and holds information about the event that called this method
    @return {void}
    **/
    unsubscribe: function(ev) {
        ev.stopImmediatePropagation();
        var id = $(ev.currentTarget).closest("a").attr('id');
        AA.settings.toggleStationAlert(id);
    },

});

/**
Provides the application a controller and view managers

@module controller
**/



/**
Top view manager. Renders a banner, the title and navigation controls

@class TopView
@Extends Backbone.Marionette.ItemView
@constructor
**/
var TopView = Backbone.Marionette.ItemView.extend({

    /**
	Identifies the template this view will use, in form of CSS/jQuery selector

	@property template
	@type String
	@static
	@final
	**/
    template: '#top_page',

    /**
	Events hash, binding events in the form
		"event DOMObject" (as in "click #my_elem")
	to methods.

	@property events
	@type Object
	@static
	@final
	**/
    events: {
        "click #top_back": "back",
        "click #top_geoloc_map": "geoloc_map",
        "click #top_cop": "cop",
    },

    /**
    Navigates the application back. This will be used by the simil-iPhone back button

    @method back
    @return {void}
    **/
    back: function() {
        window.history.back();
    },

    /**
    Asks the geolocation manager to geolocalize the user

    @method geoloc_map
    @return {void}
    **/
    geoloc_map: function() {
        AA.geoHelper.geoLocalize();
    },

    /**
    Triggers the COP event. 
	Anyone can listen to this event, currently the Controller listens it to start downloading validated data and then instantiate the view

    @method cop
    @return {void}
    **/
    cop: function() {
        this.trigger('cop');
    },

});
