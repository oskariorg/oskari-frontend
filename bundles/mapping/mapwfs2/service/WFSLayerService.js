/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService
 *
 * Handles WFS layers' states, for example selected features, top WFS layer, selected WFS layers etc.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */

    function (sandbox) {
        var me = this;
        me.sandbox = sandbox;
        me.selectedWFSLayers = [];
        me.selectedWFSLayerIds = [];
        me.selectFromAllLayers = false;
        me.selectionToolsActive = null;

        for (let p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.sandbox.registerForEventByName(me, p);
            }
        }
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'WFSLayerService',
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
            AfterMapLayerAddEvent: function (event) {
                var layer = event.getMapLayer();
                if (layer.hasFeatureData()) {
                    this.setWFSLayerSelection(layer, true);
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                var layer = event.getMapLayer();
                if (layer.hasFeatureData()) {
                    this.setWFSLayerSelection(layer, false);
                }
            }
        },

        /**
         * @method setWFSLayerSelection
         * @param {Object} WFS layer; WFS Layer which is selected or unselected
         * @param {Boolean} add; true if WFS layer is selected and false if WFS layer is removed from selections
         *
         * Handles the state of selected WFS layers
         */
        setWFSLayerSelection: function (layer, add) {
            let selectedLayers = this.getSelectedWFSLayerIds();
            const layerId = layer.getId();
            if (add) {
                selectedLayers.push(layerId);
            } else {
                selectedLayers = selectedLayers.filter(id => id !== layerId);
            }
            // update selected layers
            this.selectedWFSLayerIds = selectedLayers;
        },

        /**
         * @method getSelectedWFSLayerIds
         *
         * @return {Array} this.selectedWFSLayerIds; Ids of selected WFS layers
         */
        getSelectedWFSLayerIds: function () {
            return this.selectedWFSLayerIds;
        }
    });
