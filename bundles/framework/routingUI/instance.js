/**
 * @class Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance',
/**
 * @static constructor function
 */
function () {
    this.sandbox = null;
    this.started = false;
    this.toolActive = false;
    this.countMapClicked = null;
    this.__templates = {
        itinerary: jQuery(
                '<div class="itinerary">' +
                '<div class="duration"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="start-time"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="end-time"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="waiting-time"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="walk-time"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="transit-time"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="walk-distance"><div class="itinerary__title"></div><div class="itinerary__content"></div><div class="itinerary__clear"></div></div>'+
                '<div class="actions"></div>'+
                '</div>'
            )
    };
    this.routeColors = [
        '#ff00ff',
        '#7d26cd',
        '#ffb600',
        '#737373',
        '#ff0000',
        '#00ff00',
        '#0000ff'
    ];
}, {
    __name: 'routingUI',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization: function (key) {
        if (!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    start: function () {
        var me = this,
            conf = me.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName),
            p;

        this.sandbox = sandbox;
        sandbox.register(this);

        for (p in me.eventHandlers) {
            if(me.eventHandlers.hasOwnProperty(p)) {
                me.sandbox.registerForEventByName(me, p);
            }
        }

        this.localization = me.getLocalization();

        // stateful
        if (conf && conf.stateful) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        this.registerTool();
    },

    /**
     * Requests the tool to be added to the toolbar.
     *
     * @method registerTool
     */
    registerTool: function() {
        var me = this,
            sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
            request;

        me.popup = Oskari.clazz.create("Oskari.mapframework.bundle.routingUI.PopupRouting", me);

        me.buttonGroup = 'viewtools';
        me.toolName = 'routing';
        me.tool = {
            iconCls: 'tool-feature-selection',
            tooltip: me.localization.tool.tooltip,
            sticky: false,
            callback: function () {
                me.popup.showRoutingPopup();
            }
        };

        if (reqBuilder) {
            request = reqBuilder(this.toolName, this.buttonGroup, this.tool);
            sandbox.request(this, request);
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },

    /**
     * @method  @private __isPopupVisible is popup visible
     * @return {Boolean} is visible
     */
    __isPopupVisible: function(){
        var popup = jQuery('.tools_routing_selection:visible');
        return popup.length>0;
    },

    /**
     * eventHandlers event handlers
     */
    eventHandlers: {
        'MapClickedEvent': function (event) {
            if (!this.toolActive) {
                return;
            }

            if(!this.__isPopupVisible()) {
                return;
            }

            var me = this,
                sandbox = this.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                roundToDecimals = mapModule.getProjectionDecimals(),
                conf = me.conf,
                lonlat;

            var hasRoundDecimalsConf = (conf && conf.decimals) ? true : false;
            if(hasRoundDecimalsConf && !conf.decimals[mapModule.getProjection()]) {
                roundToDecimals = conf.decimals;
            } else if(hasRoundDecimalsConf && conf.decimals[mapModule.getProjection()]){
                roundToDecimals = conf.decimals[mapModule.getProjection()];
            }

            lonlat = event.getLonLat();
            lonlat.lon = lonlat.lon.toFixed(roundToDecimals);
            lonlat.lat = lonlat.lat.toFixed(roundToDecimals);

            if (this.countMapClicked === null) {
                this.countMapClicked += 1;
                this.popup.setStartingPoint(lonlat);
            } else if (this.countMapClicked === 1) {
                this.countMapClicked = null;
                this.popup.setFinishingPoint(lonlat);
            }
        },
        'RouteResultEvent': function (event) {
            var me = this,
                loc = me.localization;
            if(!me.__isPopupVisible()) {
                return;
            }

            me.popup.progressSpinner.stop();
            if(event.getSuccess()) {
                me.__renderPlan(event.getPlan());
            } else {
                me.__showMessage(loc.error.title, loc.error.message);
            }
        }
    },

    /**
     * @method  @private __showMessage show wanted message
     * @param  {String} title   message title
     * @param  {String} message message
     */
    __showMessage: function(title, message){
        var me = this,
            routeDiv = me.popup.popupContent.find('.route-instructions'),
            titleDiv = routeDiv.find('.title'),
            instructionsDiv = routeDiv.find('.instructions');
        titleDiv.empty();
        instructionsDiv.empty();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(title, message);
        dialog.fadeout();
    },

    /**
     * @method @private __renderPlan render plan
     * @param  {Object} plan plan object
     */
    __renderPlan: function(plan){
        var me = this,
            loc = me.localization,
            accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion'),
            panel = null,
            titlePanel = jQuery('<div>'),
            routeDiv = me.popup.popupContent.find('.route-instructions'),
            titleDiv = routeDiv.find('.title'),
            instructionsDiv = routeDiv.find('.instructions');

            titleDiv.empty();
            instructionsDiv.empty();

            var title = loc.routeInstructions.titleOne;
            if(plan.itineraries.length>1){
                title = loc.routeInstructions.titleMulti.replace('{count}',plan.itineraries.length);
            }
            titleDiv.html('<h4>' + title + '</h4>');

            _.forEach(plan.itineraries, function (itinerary, index) {
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                var panelTitle = loc.routeInstructions.route + ' ' + (index+1);
                panel.setTitle(panelTitle);

                var content = me.__templates.itinerary.clone();
                content.find('div.duration div.itinerary__title').html(loc.routeInstructions.duration + ':');
                content.find('div.duration div.itinerary__content').html(me._formatTime(itinerary.duration));

                content.find('div.start-time div.itinerary__title').html(loc.routeInstructions.startTime + ':');
                content.find('div.start-time div.itinerary__content').html(me._formatDate(itinerary.startTime));

                content.find('div.end-time div.itinerary__title').html(loc.routeInstructions.endTime + ':');
                content.find('div.end-time div.itinerary__content').html(me._formatDate(itinerary.endTime));

                content.find('div.waiting-time div.itinerary__title').html(loc.routeInstructions.waitingTime + ':');
                content.find('div.waiting-time div.itinerary__content').html(me._formatTime(itinerary.waitingTime));

                content.find('div.walking-time div.itinerary__title').html(loc.routeInstructions.walkingTime + ':');
                content.find('div.walking-time div.itinerary__content').html(me._formatTime(itinerary.walkTime));

                content.find('div.transit-time div.itinerary__title').html(loc.routeInstructions.transitTime + ':');
                content.find('div.transit-time div.itinerary__content').html(me._formatTime(itinerary.transitTime));

                content.find('div.walk-distance div.itinerary__title').html(loc.routeInstructions.walkDistance + ':');
                content.find('div.walk-distance div.itinerary__content').html(me._formatLength(itinerary.walkDistance));

                var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                btn.setTitle(loc.routeInstructions.showRoute);
                btn.setHandler(function() {
                    var routeColorIndex = index;
                    if(index>me.routeColors.length-1) {
                        var a = index % (me.routeColors.length-1);
                        var b = index % (me.routeColors.length-1-a);
                        routeColorIndex = b + a;
                    }
                    me._renderRoute(itinerary.geoJSON, me.routeColors[routeColorIndex]);
                });
                btn.insertTo(content.find('div.actions'));

                panel.setContent(content);
                panel.setVisible(true);
                panel.close();
                accordion.addPanel(panel);
            });

            accordion.insertTo(instructionsDiv);
    },

    /**
     * @method  @private _renderRoute render toute to map
     * @param  {String} geom  route geoJSON
     * @param  {String} color route color
     */
    _renderRoute: function (geom, color) {
        var me = this,
            rn = 'MapModulePlugin.AddFeaturesToMapRequest',
            colorRGB = Oskari.util.hexToRgb(color),
            style = {
                stroke: {
                    width: 5,
                    color: 'rgba('+colorRGB.r+', '+colorRGB.g+','+colorRGB.b+', 0.7)'
                }
            };
        this.sandbox.postRequestByName(rn, [geom, {
            layerId: null,
            clearPrevious: true,
            layerOptions: null,
            centerTo: false,
            attributes: null,
            featureStyle: style
        }]);
    },


    /**
     * @method  @private _formatDate format date to string
     * @param  {Float} dateMilliseconds millisecond presentation of day
     * @return {String} date formatted string
     */
    _formatDate: function(dateMilliseconds){
        var momentString = moment('' +dateMilliseconds, 'x').format('DD.MM.YYYY HH:mm:ss');
        return momentString;
    },

    /**
     * [_formatLength description]
     * @param  {Float} length length in meters
     * @return {String} string format presentation of length
     */
    _formatLength: function (length) {
        var newLength = '';
        if (length > 1000) {
            var kilometers = this._decimalAdjust('round', length/1000, -1);
            newLength = kilometers + " km";
        } else {
            var meters = this._decimalAdjust('round', length, 1);
            newLength = meters + " m";
        }
        return newLength;
    },

    /**
     * Decimal adjustment of a number.
     * @method  @private _decimalAdjust
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    _decimalAdjust: function (type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    },

    /**
     * @method  @private _formatTime format time to string
     * @param  {Float} secs second to conver
     * @return {string} formetted time
     */
    _formatTime: function (secs) {
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        var duration = '';

        if (hours === 0) {
            if (minutes === 0) {
                duration = seconds + " s";
            } else {
                duration = minutes + " min";
            }
        } else {
            duration = hours + " h " + minutes + " min";
        }
        return duration;
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
