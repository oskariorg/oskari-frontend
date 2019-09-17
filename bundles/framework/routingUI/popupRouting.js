/**
 * @class Oskari.mapframework.bundle.routingUI.PopupRouting
 *
 * Handles routing popup functionality.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.routingUI.PopupRouting',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = this.instance.sandbox;
        this.loc = this.instance._localization.popup;

        this.template = {};
        for (var p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }

        this.params = {};
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner');
        this.markerIds = {
            start: 'routing-marker-start',
            end: 'routing-marker-end'
        };
    }, {

        __templates: {
            'wrapper': '<div></div>',
            'instructions': '<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',
            'routeInstructions': '<div class="route-instructions"><div class="title"></div><div class="instructions"></div></div>'
        },
        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        showRoutingPopup: function () {
            var me = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                popupLoc = this.loc.title,
                instructions;
            me.popupContent = me.template.wrapper.clone();

            instructions = me.template.instructions.clone();
            instructions.append(this.loc.instructions);
            me.popupContent.append(instructions);

            me.renderRoutingOptions();

            me.progressSpinner.insertTo(me.popupContent);

            // Safety check at not show more than one popup
            if (jQuery('.tools_routing_selection').is(':visible')) {
                return;
            }

            var controlButtons = [];

            var getRouteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            getRouteBtn.setTitle(this.loc.button.getRoute);
            getRouteBtn.setHandler(function () {
                me.progressSpinner.start();
                me.params.srs = me.sandbox.getMap().getSrsName();
                me.sandbox.postRequestByName('GetRouteRequest', [me.params]);
                me._removeFeaturesFromMap();
            });
            controlButtons.push(getRouteBtn);
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.button.cancel);
            cancelBtn.setHandler(function () {
                popup.close(true);
                me.stopTool();
                me._removeFeaturesFromMap();
                me.removeMarkersFromMap();
            });
            cancelBtn.addClass('primary');
            cancelBtn.blur();
            controlButtons.push(cancelBtn);

            popup.addClass('tools_routing_selection');
            popup.show(popupLoc, this.popupContent, controlButtons);
            popup.moveTo('#toolbar div.toolrow[tbgroup=default-viewtools]', 'top');
            this.startTool();
        },

        /**
         * Starts the tool
         * (for now only sets its `active` property to true)
         *
         * @method startTool
         */
        startTool: function () {
            this.instance.toolActive = true;
            this.enableGFI(false);
        },
        /**
         * Stops the tool
         * (for now only sets its `active` property to false)
         *
         * @method stopTool
         */
        stopTool: function () {
            this.instance.toolActive = false;
            this.enableGFI(true);
            this.removeMarkersFromMap();
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGFI: function (blnEnable) {
            var gfiReqBuilder = Oskari.requestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
            );
            // enable or disable gfi requests
            if (gfiReqBuilder) {
                this.sandbox.request(this.instance, gfiReqBuilder(blnEnable));
            }
        },

        /**
         * @method _removeFeaturesFromMap
         * @private
         * Removes features from map.
         *
         * @param {String} identifier the identifier
         * @param {String} value the identifier value
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        _removeFeaturesFromMap: function (identifier, value, layer) {
            var me = this,
                rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';

            me.sandbox.postRequestByName(rn, [identifier, value, layer]);
        },

        /**
         * @method  @public removeMarkersFromMap remove markers from map
         */
        removeMarkersFromMap: function () {
            var me = this,
                reqBuilder = Oskari.requestBuilder(
                    'MapModulePlugin.RemoveMarkersRequest'
                );

            if (reqBuilder) {
                me.sandbox.request(me.instance.getName(), reqBuilder([me.markerIds.start]));
                me.sandbox.request(me.instance.getName(), reqBuilder([me.markerIds.end]));
            }
        },

        /**
         * @method renderRoutingOptions
         * Renders fields to popup for gicing parameters to route
         */
        renderRoutingOptions: function () {
            var me = this;

            var startingPointField = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            startingPointField.setIds('startingPoint', 'startingPointInput');
            startingPointField.setPlaceholder(me.loc.startingPointTooltip);
            startingPointField.getField().addClass('routing-field');
            startingPointField.setEnabled(false);
            me.popupContent.append(startingPointField.getField());

            var finishingPointField = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            finishingPointField.setIds('finishingPoint', 'finishingPointInput');
            finishingPointField.setPlaceholder(me.loc.finishingPointTooltip);
            finishingPointField.getField().addClass('routing-field');
            finishingPointField.setEnabled(false);
            me.popupContent.append(finishingPointField.getField());

            var routeInstructions = me.template.routeInstructions.clone();
            me.popupContent.append(routeInstructions);
        },
        /**
         * @method setStartingPoint
         * Sets starting point to this.params
         * @param {Object} lonlat
         */
        setStartingPoint: function (lonlat) {
            var me = this;
            me.params.fromlon = lonlat.lon;
            me.params.fromlat = lonlat.lat;
            me.popupContent.find('#startingPointInput').val(lonlat.lon + ' , ' + lonlat.lat);
            me._setMarker(lonlat.lon, lonlat.lat, true, '3DCE00', me.loc.startingPoint, me.markerIds.start);
        },

        /**
         * @method setFinishingPoint
         * Sets finishing point to this.params
         * @param {Object} lonlat
         */
        setFinishingPoint: function (lonlat) {
            var me = this;
            me.params.tolon = lonlat.lon;
            me.params.tolat = lonlat.lat;
            me.popupContent.find('#finishingPointInput').val(lonlat.lon + ' , ' + lonlat.lat);
            me._setMarker(lonlat.lon, lonlat.lat, false, 'CE0000', me.loc.finishingPoint, me.markerIds.end);
        },

        /**
         * [_setMarker description]
         * @param {Double} lon       lon coordinate
         * @param {Double} lat       lat coordinate
         * @param {Boolean} removeOld remove old markers
         * @param {String} color     hex marker color without starting #
         * @param {String} msg       marker message
         * @param {String} markerId marker id
         */
        _setMarker: function (lon, lat, removeOld, color, msg, markerId) {
            var me = this,
                reqBuilder,
                sandbox = me.sandbox;

            if (removeOld && removeOld === true) {
                me.removeMarkersFromMap();
            }
            // Add new marker
            reqBuilder = Oskari.requestBuilder(
                'MapModulePlugin.AddMarkerRequest'
            );
            if (reqBuilder) {
                sandbox.request(
                    me.instance.getName(),
                    reqBuilder({
                        color: color,
                        msg: msg,
                        shape: 2,
                        size: 3,
                        x: lon,
                        y: lat,
                        transient: true
                    }, markerId)
                );
            }
        }
    });
