/**
 * @class Oskari.userinterface.component.PopupService
 *
 * Handles WFS layers' states, for example selected features, top WFS layer, selected WFS layers etc.
 */
Oskari.clazz.define(
    'Oskari.userinterface.component.PopupService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */

    function (sandbox) {
        var me = this,
            p;
        
        me.popups = [];

        me.sandbox = sandbox;
        for (p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.sandbox.registerForEventByName(me, p);
            }
        }

    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.userinterface.component.PopupService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "PopupService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @public @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },

        /**
         * @static @property {Object} eventHandlers
         */
        eventHandlers: {
            /*
            AfterMapLayerAddEvent: function (event) {
                var me = this,
                    layer = event._mapLayer;
                if (layer.hasFeatureData()) {
                    me.setWFSLayerSelection(layer, true);
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                var me = this,
                    layer = event._mapLayer;
                if (layer.hasFeatureData()) {
                    me.setWFSLayerSelection(layer, false);
                }
            }
            */
        },
        stop: function() {
            var me = this,
                p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }
        },


        /**
         * @method createPopup Creates a popup and adds to internal bookkeeping
         */
        createPopup: function() {
            var me = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            popup.onShow(function() {
                //add the popup to bookkeeping
                me.popups.push(popup);
            });

            popup.onClose(function() {
                var found = false,
                    i;
                for (i = 0; i < me.popups.length; i++) {
                    if (popup === me.popups[i]) {
                        //found
                        found = true;
                        break;
                    }
                }
                if (found) {
                    me.popups[i].clearListeners();
                    me.popups.splice(i, 1);
                }
            });

            return popup;
        },
        /**
         * @method closeAllPopups Close all registered popups.
         * @param {Oskari.userinterface.component.Popup} except Optional. If provided, closes all other popups except the one provided.
         */
        closeAllPopups: function(except) {
            _.each(this.popups, function(popup) {
                popup.close();
            })
        },
        isPopupVisible: function(popup) {
            for (var i = 0; i < this.popups.length; i++) {
                if (popup === this.popups[i]) {
                    return true;
                }
            }

            return false;
        }
    });
