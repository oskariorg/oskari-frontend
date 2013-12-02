/**
 * @class Oskari.statistics.bundle.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.GridModeView',
    /**
     * @static constructor function
     */

    function () {}, {

        /**
         * @method startPlugin
         * called by host to start view operations
         */
        startPlugin: function () {
            var me = this,
                sandbox = me.instance.getSandbox();

            this.toolbar = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatsToolbar', {
                title: me.getTitle()
            }, this.instance);

            this.requestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.StatsGridRequestHandler', me);
            sandbox.addRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);

            var el = me.getEl();
            el.addClass("statsgrid");
        },

        /**
         * Updates the layer, enters/exits the mode and creates the UI
         * to display the indicators selection and the grid.
         *
         * @method prepareMode
         * @param {Boolean} isShown True to enter the mode, false to exit the mode
         * @param {Object} layer The layer visualizations should be applied to
         * @param {Boolean} blnFromExtensionEvent
         */
        prepareMode: function (isShown, layer, blnFromExtensionEvent) {
            var me = this;
            // Do not enter the mode if it's already on.
            if (!me.isVisible || !isShown) {
                me.isVisible = (isShown == true);

                // Update the layer if current layer is null or if the layer has changed.
                if ((layer && (me._layer === null || me._layer === undefined)) ||
                    (layer && me._layer.getId() + '' !== layer.getId() + '')) {
                    me._layer = layer;
                    // Notify the grid plugin of the changed layer.
                    me.instance.gridPlugin.setLayer(layer);
                    // Save the changed layer to the state.
                    me.instance.state.layerId = me._layer.getId();
                    me.toolbar.changeName(me.instance.getLocalization('tile').title + ' - ' + me._layer.getName());
                }
                // use default layer if we're showing the UI and don't have a layer
                var layerAdded = me.isVisible && me._layer === null || me._layer === undefined;
                if (layerAdded) {
                    me._layer = me.instance.sandbox.findMapLayerFromSelectedMapLayers(me.instance.conf.defaultLayerId);
                    if (!me._layer) {
                        me._layer = me.instance.sandbox.findMapLayerFromAllAvailable(me.instance.conf.defaultLayerId);
                        if (me._layer) {
                            // add layer to selection if it's available
                            me.instance.sandbox.postRequestByName('AddMapLayerRequest', [me._layer.getId(), false, me._layer.isBaseLayer()]);
                        }
                    }
                    if (me._layer) {
                        // Notify the grid plugin of the changed layer.
                        me.instance.gridPlugin.setLayer(me._layer);
                        // Save the changed layer to the state.
                        me.instance.state.layerId = me._layer.getId();
                        me.toolbar.changeName(me.instance.getLocalization('tile').title + ' - ' + me._layer.getName());
                    }
                } else if (!me.isVisible && me._layer) {
                    me._layer = null;
                }

                var toggle = function () {
                    // Enter/exit the mode.
                    me.showMode(isShown, blnFromExtensionEvent);
                    // Show/hide the content.
                    me.showContent(isShown);

                    if (isShown) {
                        // Create the indicators selection and the grid.
                        me.instance.gridPlugin.createStatsOut(me.getEl());
                    }

                    // Notify other components of the mode change.
                    var eventBuilder = me.instance.getSandbox().getEventBuilder('StatsGrid.ModeChangedEvent');
                    if (eventBuilder) {
                        var evt = eventBuilder(me.isVisible);
                        me.instance.getSandbox().notifyAll(evt);
                    }
                };
                // Don't toggle if we're showing and there's no layer
                if (!(!me._layer && isShown)) {
                    if (layerAdded) {
                        // wait a bit so the OL layers are surely added
                        window.setTimeout(toggle, 50);
                    } else {
                        toggle();
                    }
                }
            }
        },

        /**
         * Sets the DOM to the mode and updates the map size.
         *
         * @method showMode
         * @param {Boolean} isShown Entering/exiting the mode.
         * @param {Boolean} blnFromExtensionEvent
         */
        showMode: function (isShown, blnFromExtensionEvent) {
            var me = this,
                sandbox = this.instance.getSandbox();
            this.toolbar.show(isShown);

            var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule'),
                map = mapModule.getMap(),
                elCenter = this.getCenterColumn(),
                elLeft = this.getLeftColumn();

            if (isShown) {
                /** ENTER The Mode */

                /** Center Finland and set zoom to min **/
                var newCenter = new OpenLayers.LonLat(520000, 7250000);
                mapModule.centerMap(newCenter, 0);

                jQuery('#contentMap').addClass('statsgrid-contentMap');
                jQuery('.oskariui-mode-content').addClass('statsgrid-mode');
                // TODO we are going to create a handle for grid vs. map separator
                var leftWidth = 40;

                /** show our mode view - view hacks */
                elCenter.removeClass('span12');
                elCenter.width((100 - leftWidth) + '%');
                // remove toolbar's height
                jQuery('#mapdiv').height(jQuery(window).height() - jQuery('#contentMap').find('.oskariui-menutoolbar').height());
                //window resize is handled in mapfull - instance.js
                elLeft.empty();
                elLeft.removeClass('oskari-closed');
                elLeft.width(leftWidth + '%');
                elLeft.resizable({
                    minWidth: 450,
                    handles: "e",
                    resize: function (event, ui) {
                        elCenter.width(jQuery('.row-fluid').width() - elLeft.width());
                        me.instance.gridPlugin.grid.resizeCanvas();
                    },
                    stop: function (event, ui) {
                        var difference = ui.size.width - ui.originalSize.width;
                        var slickHeader = jQuery('div.slick-header-columns');
                        slickHeader.width(slickHeader.width() + difference);

                        map.updateSize();
                    }
                });

                /** a hack to notify openlayers of map size change */
                map.updateSize();

            } else {
                /** EXIT The Mode */

                jQuery('#contentMap').removeClass('statsgrid-contentMap');
                jQuery('.oskariui-mode-content').removeClass('statsgrid-mode');

                // remove width from center-div
                elCenter.width('').addClass('span12');
                jQuery('#mapdiv').height(jQuery(window).height());

                elLeft.resizable().resizable('destroy');
                elLeft.addClass('oskari-closed');
                // remove width from left-div
                elLeft.width(''); //removeClass('span7');
                elLeft.empty();

                if (!blnFromExtensionEvent) {
                    // reset tile state if not triggered by tile click
                    // postRequestbyName is banned! sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
                    var request = sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(this.instance, 'close', this.instance.getName());
                    sandbox.request(this.instance.getName(), request);
                }

                /** a hack to notify openlayers of map size change */
                map.updateSize();
            }
        },
        getLeftColumn: function () {
            return jQuery('.oskariui-left');
        },
        getCenterColumn: function () {
            return jQuery('.oskariui-center');
        },
        getRightColumn: function () {
            return jQuery('.oskariui-right');
        },
        /**
         * @method stopPlugin
         * called by host to stop view operations
         */
        stopPlugin: function () {
            this.toolbar.destroy();
            sandbox.removeRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);
        }
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });