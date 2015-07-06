/**
 * @class Oskari.mapframework.bundle.routingUI.PopupRouting
 *
 * Handles routing popup functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.routingUI.PopupRouting",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;

        this.sandbox = this.instance.sandbox;

        this.loc = this.instance._localization.popup;
        /*

        this.routingService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.routingService.service.RoutingServiceBundleInstance',
                this, this.searchUrl);
        */
        
        /* templates */

        this.template = {};
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }

        this.params = {};
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner');
    }, {

        __templates: {
            "wrapper": '<div></div>',
            "instructions": '<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',
            "routeInstructions": '<div class="route-instructions"></div>'
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
            if(jQuery('.tools_selection').is(':visible')) {
                return;
            }

            var controlButtons = [];

            var getRouteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            getRouteBtn.setTitle(this.loc.button.getRoute);
            getRouteBtn.setHandler(function () {
                me.progressSpinner.start();
                me.params.srs = me.sandbox.getMap().getSrsName();
                // Remove selections
                console.log("parse params from form and return params as an object");

                me.sandbox.postRequestByName('GetRouteRequest', [me.params]);

            });
            controlButtons.push(getRouteBtn);
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.button.cancel);
            cancelBtn.setHandler(function () {
                //destroy the active sketch, disable the selected control
                popup.close(true);
                me.stopTool();
            });
            cancelBtn.addClass('primary');
            cancelBtn.blur();
            controlButtons.push(cancelBtn);

            popup.addClass('tools_selection');
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
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGFI: function (blnEnable) {
            var gfiReqBuilder = this.sandbox.getRequestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
                );
            // enable or disable gfi requests
            if (gfiReqBuilder) {
                this.sandbox.request(this.instance, gfiReqBuilder(blnEnable));
            }
        },

        /**
         * @method renderRoutingOptions
         * Renders fields to popup for gicing parameters to route
         */
        renderRoutingOptions: function () {
            var me = this;

            var startingPointField = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            startingPointField.setIds("startingPoint", "startingPointInput");
            startingPointField.setPlaceholder(me.loc.startingPointTooltip);
            startingPointField.getField().addClass("routing-field");
            me.popupContent.append(startingPointField.getField());

            var finishingPointField = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            finishingPointField.setIds("finishingPoint", "finishingPointInput");
            finishingPointField.setPlaceholder(me.loc.finishingPointTooltip);
            finishingPointField.getField().addClass("routing-field");
            finishingPointField.setEnabled(false);
            me.popupContent.append(finishingPointField.getField());


        },
        
        /**
         * @method setStartingPoint
         * Sets starting point to this.params
         * @param {Object} lonlat
         */
        setStartingPoint: function (lonlat) {
            this.params.fromlon = lonlat.lon;
            this.params.fromlat = lonlat.lat;

            this.popupContent.find('#startingPointInput').val(lonlat.lon + " , " + lonlat.lat);
            this.popupContent.find('#finishingPointInput').attr("disabled", false);
            this.popupContent.find('#finishingPointInput').focus();
            console.log("startingPoint:", this.params);
        },

        /**
         * @method setFinishingPoint
         * Sets finishing point to this.params
         * @param {Object} lonlat
         */
        setFinishingPoint: function (lonlat) {
            this.params.tolon = lonlat.lon;
            this.params.tolat = lonlat.lat;

            this.popupContent.find('#finishingPointInput').val(lonlat.lon + " , " + lonlat.lat);
            console.log("finishingPoint:", this.params);
        }
    });
