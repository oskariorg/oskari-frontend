/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
 *
 * Adds mouse and keyboard controls to the map and adds tools controls
 * for zoombox and measurement (line/area). Also adds request handling for
 * ToolSelectionRequest, EnableMapKeyboardMovementRequest, DisableMapKeyboardMovementRequest,
 * EnableMapMouseMovementRequest and DisableMapMouseMovementRequest.
 * Overrides OpenLayers keyboard/mouse controls with PorttiKeyboard and PorttiMouse.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.ControlsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.ControlsPlugin';
        me._name = 'ControlsPlugin';
        me.boxZoom = null;
        me.removedInteractions = [];
    }, {
        /**
         * @public @method hasUI
         * This plugin doesn't have a UI, BUT it is controllable in publisher so it is added to map
         * when publisher starts -> always return true to NOT get second navControl on map when publisher starts
         * FIXME this is clearly a hack
         *
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol
         *
         *
         */
        _startPluginImpl: function () {
            var me = this;
            me._createMapInteractions();
        },

        _createEventHandlers: function () {
            return {
                /**
                * @method Toolbar.ToolSelectedEvent
                * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
                */
                'DrawingEvent': function (event) {
                    if(event.getId() !== 'measureline' && event.getId() !== 'measurearea') {
                        // this isn't about measurements, stop processing it
                        return;
                    }

                    var me = this,
                        measureValue,
                        data = event.getData(),
                        finished = event.getIsFinished(),
                        geoJson = event.getGeoJson(),
                        geomMimeType = 'application/json';

                    if (data.showMeasureOnMap) {
                        return;
                    }

                    // FIXME! Does StopDrawingRequest need to send drawingEvent?
                    if (finished) {
                        return;
                    }

                    if (data.shape === 'LineString') {
                        measureValue = data.lenght;
                    } else if (data.shape === 'Polygon') {
                         measureValue = data.area;
                    }
                    var reqBuilder = me.getSandbox().getRequestBuilder('ShowMapMeasurementRequest');
                    if(reqBuilder) {
                        me.getSandbox().request(me, reqBuilder(measureValue, finished, geoJson, geomMimeType));
                    }
                },
                /**
                 * @method Toolbar.ToolSelectedEvent
                 * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
                 */

                'Toolbar.ToolSelectedEvent': function (event) {
                    if ( event._toolId !== "zoombox" ) {
                        this.disableMouseDragZoom();
                    }
                    return;
                }
            };
        },

        _createRequestHandlers: function () {
            var me = this;
            var mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', me.getMapModule());
            return {
                'ToolSelectionRequest': Oskari.clazz.create(
                    'Oskari.mapframework.mapmodule.ToolSelectionHandler',
                    me.getSandbox(),
                    me
                ),
                'EnableMapKeyboardMovementRequest' : mapMovementHandler,
                'DisableMapKeyboardMovementRequest' : mapMovementHandler,
                'EnableMapMouseMovementRequest' : mapMovementHandler,
                'DisableMapMouseMovementRequest' : mapMovementHandler
            };
        },
        disableMouseDragZoom: function () {
            var me = this;
            if ( this.boxZoom ) {
                this.getMap().removeInteraction( this.boxZoom );
            }
            this.removedInteractions.forEach( function ( interaction ) {
                me.getMap().addInteraction( interaction );
            });
            this.removedInteractions = [];
        },
        mouseDragZoomInteraction: function () {
            var me = this;

            me.getMap().getInteractions().forEach( function( interaction ) {
                if ( interaction instanceof ol.interaction.DragPan || interaction instanceof ol.interaction.DragZoom ) {
                    me.getMap().removeInteraction( interaction );
                    me.removedInteractions.push( interaction );
                }
            });
            if ( !this.boxZoom ) {
                this.boxZoom = new ol.interaction.DragZoom({
                    condition: function ( mapBrowserEvent ) {
                        return ol.events.condition.mouseOnly( mapBrowserEvent );
                    }
                });
            }

            this.getMap().addInteraction( this.boxZoom );
        },
        /**
         * @private @method _createMapControls
         * Constructs/initializes necessary controls for the map. After this they can be added to the map
         * with _addMapControls().
         *
         */
        _createMapInteractions: function () {
            var me = this,
            conf = me.getConfig();
            var mouseInteractionRemove = [];
            var kbInteractionRemove = [];

            // Map movement/keyboard control
            if (conf.keyboardControls === false) {
              me.getMap().getInteractions().forEach( function( interaction ) {
                if ( interaction instanceof ol.interaction.KeyboardPan || interaction instanceof ol.interaction.KeyboardZoom ) {
                  kbInteractionRemove.push( interaction );
                }
              });
              kbInteractionRemove.forEach( function ( interaction ) {
                me.getMap().removeInteraction( interaction );
              })
            }

            // mouse control
            if (conf.mouseControls === false) {
              me.getMap().getInteractions().forEach(function(interaction){
                if (interaction instanceof ol.interaction.DragPan ||interaction instanceof ol.interaction.MouseWheelZoom || interaction instanceof ol.interaction.DoubleClickZoom || interaction instanceof ol.interaction.DragZoom ){
                  mouseInteractionRemove.push(interaction);
                }
              });
              mouseInteractionRemove.forEach(function(interaction){
                me.getMap().removeInteraction(interaction);
              })
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
