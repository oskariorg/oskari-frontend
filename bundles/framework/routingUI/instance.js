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

    eventHandlers: {
        'MapClickedEvent': function (event) {
            if (!this.toolActive) {
                return;
            }
            if (this.countMapClicked === null) {
                this.countMapClicked += 1;
                this.popup.setStartingPoint(event.getLonLat());
            } else if (this.countMapClicked === 1) {
                this.countMapClicked = null;
                this.popup.setFinishingPoint(event.getLonLat());
            }
        },
        'RouteSuccessEvent': function (event) {
            var geom = event.getGeoJson();
            this.renderRoute(geom);

            var instructions = event.getRouteInstructions();
            this.renderInstructions(instructions);
        }
    },

    renderRoute: function (geom) {
        var me = this,
            rn = 'MapModulePlugin.AddFeaturesToMapRequest',
            style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
        style.strokeColor = '#9966FF';
        style.strokeWidth = 5;
        style.strokeOpacity = 0.7;
        this.sandbox.postRequestByName(rn, [geom, 'GeoJSON', null, null, 'replace', true, style, false]);
        me.popup.progressSpinner.stop();
    },

    renderInstructions: function (instructions) {
        var me = this,
            loc = me.localization,
            routeLenght = me.formatLenght(instructions.length),
            routeDuration = me.formatTime(instructions.duration),
            legList = jQuery('<div><ul></ul></div>').clone(),
            listElement = '<li></li>',
            routeDiv = me.popup.popupContent.find('.route-instructions');

        routeDiv.empty();
        instructionDiv = '<div>' + loc.routeInstructions.length + routeLenght + ', ' + loc.routeInstructions.duration + routeDuration + '</div>';

        _.forEach(instructions.legs, function (leg) {
            var listEl = jQuery(listElement).clone(),
                length = me.formatLenght(leg.length),
                duration = me.formatTime(leg.duration);


            listEl.html(loc.transportTypeIds[leg.type] + ', ' + length + ', ' + duration);
            legList.append(listEl);
        });

        routeDiv.append(instructionDiv);
        routeDiv.append(legList);
    },

    formatLenght: function (length) {
        if (length > 1000) {
            var kilometers = this.decimalAdjust('round', length/1000, -1);
            var newLength = kilometers + " km";
        } else {
            var meters = this.decimalAdjust('round', length, 1);
            var newLength = meters + " m";
        }
        return newLength;
    },

    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    decimalAdjust: function (type, value, exp) {
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

    formatTime: function (seconds) {
        var secs = Math.round(seconds);
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        if (hours === 0) {
            if (minutes === 0) {
                var duration = seconds + " s";
            } else {
                var duration = minutes + " min";
            }
        } else {
            var duration = hours + " h " + minutes + " min";
        }
        return duration;
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
