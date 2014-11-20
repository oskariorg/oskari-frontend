/**
 * @class Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin';
        me._name = 'MyPlaces.HoverPlugin';
    }, {
        /**
         * Initializes the plugin:
         * - openlayers hover control
         * @method
         */
        _initImpl: function () {
            var me = this;

            OpenLayers.Control.Hover = OpenLayers.Class(
                OpenLayers.Control, {
                    defaultHandlerOptions: {
                        'delay': 500,
                        'pixelTolerance': null,
                        'stopMove': false
                    },

                    initialize: function (options) {
                        this.handlerOptions = OpenLayers.Util.extend({},
                            this.defaultHandlerOptions
                        );
                        OpenLayers.Control.prototype.initialize.apply(
                            this,
                            arguments
                        );
                        this.handler = new OpenLayers.Handler.Hover(
                            this, {
                                'pause': this.onPause,
                                'move': this.onMove
                            },
                            this.handlerOptions
                        );
                    },

                    onPause: function (evt) {},

                    onMove: function (evt) {
                        // if this control sent an Ajax request (e.g. GetFeatureInfo) when
                        // the mouse pauses the onMove callback could be used to abort that
                        // request.
                    }
                }
            );

            me.hoverControl = new OpenLayers.Control.Hover({
                handlerOptions: {
                    'delay': 500,
                    'pixelTolerance': 6
                },

                onPause: function (evt) {
                    var lonlat = me._map.getLonLatFromPixel(evt.xy),
                        event = me.getSandbox().getEventBuilder(
                                'MyPlaces.MyPlaceHoverEvent'
                            )(lonlat, evt, me._map.getZoom());
                    me.getSandbox().notifyAll(event);
                }
            });
            // TODO should this be extended from BasicMapModulePlugin afterall?
            me.getMap().addControl(me.hoverControl);

        },

        // should activate when omat paikat layer is shown
        activate: function () {
            this.hoverControl.activate();

        },

        // should activate when omat paikat layer is not shown
        deactivate: function () {
            this.hoverControl.deactivate();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
