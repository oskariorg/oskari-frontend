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
        me.WFSFeatureSelections = [];
        me.selectedWFSLayers = [];
        me.selectedWFSLayerIds = [];
        me.selectFromAllLayers = false;
        me.selectionToolsActive = null;
        me.analysisWFSLayerId = null;

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
                this.__removeFeatureSelectionForLayer(layerId);
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
        },

        /**
         * @method getTopWFSLayer
         *
         * @return {Number} me.topWFSLayer; Id of the top WFS layer
         */
        getTopWFSLayer: function () {
            var me = this,
                layers = me.sandbox.findAllSelectedMapLayers(),
                topWFSLayer;

            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.hasFeatureData()) {
                    topWFSLayer = layer._id;
                }
            }
            return topWFSLayer;
        },

        /**
         * @method setWFSFeaturesSelections
         * @param {Number} layeIdr; LayerID whose feature selections are chenged
         * @param {Array} featureIds; featureIds that are selected or removed from selection
         * @param {Boolean} makeNewSelection; true if user makes selections with selection tool without Ctrl
         *
         * Handles status of selected features
         */
        setWFSFeaturesSelections: function (layerId, featureIds, makeNewSelection) {
            let selectedFeatureIds = featureIds;
            if (!makeNewSelection) {
                const previousSelectedFeatureIds = this.getSelectedFeatureIds(layerId);
                // Either add all featureIds or remove all feature Ids from selection. Don't mix.
                const shouldRemoveFeaturesFromSelection = previousSelectedFeatureIds.some(selected => featureIds.includes(selected));
                if (shouldRemoveFeaturesFromSelection) {
                    selectedFeatureIds = previousSelectedFeatureIds.filter(id => !featureIds.includes(id));
                } else {
                    selectedFeatureIds = [...previousSelectedFeatureIds, ...featureIds];
                }
            }
            // clear old selection
            this.__removeFeatureSelectionForLayer(layerId);
            // add the updated selection
            this.getWFSSelections().push({ layerId, featureIds: selectedFeatureIds });
        },

        /**
         * @method getWFSSelections
         *
         * @return {array} this.WFSFeatureSelections
         *
         * Returns array of objects including slected layers id and selected features of layers.
         */
        getWFSSelections: function () {
            return this.WFSFeatureSelections;
        },

        /**
         * @method getSelectedFeatureIds
         * @param {Number} layerID; ID of layer whose selected featureIds are wanted
         *
         * @return {array} featureIds
         *
         * Returns selected featureIds of the given layer ID. If no layerId is given, returns all the selected featureIds.
         */
        getSelectedFeatureIds: function (layerId) {
            return this.getWFSSelections()
                .filter((item) => item.layerId === layerId)
                .flatMap((item) => item.featureIds);
        },

        /**
         * @method emptyWFSFeatureSelections
         * @param {Object} layer; layer whose selected features are going to be removed
         *
         *
         * Changes the values of me.WFSFeatureSelections and sends WFSFeaturesSelectedEvent to notify others about it
         */
        emptyWFSFeatureSelections: function (layer) {
            if (!layer) {
                return;
            }
            const layerId = layer.getId();
            const features = this.getSelectedFeatureIds(layerId);
            if (!features) {
                return;
            }
            this.__removeFeatureSelectionForLayer(layerId);
            var event = Oskari.eventBuilder('WFSFeaturesSelectedEvent')([], layer, false);
            this.sandbox.notifyAll(event);
        },
        __removeFeatureSelectionForLayer: function (layerId) {
            if (typeof layerId === 'undefined') {
                return;
            }
            const selectedFeatures = this.getWFSSelections();
            this.WFSFeatureSelections = selectedFeatures.filter(item => item.layerId !== layerId);
        },
        /*
         * @method emptyWFSFeatureSelections
         *
         * Convenience function to clear selections from all WFS layers
         */
        emptyAllWFSFeatureSelections: function () {
            const selections = this.WFSFeatureSelections || [];
            selections.forEach((selection) => {
                var layer = this.sandbox.findMapLayerFromSelectedMapLayers(selection.layerId);
                this.emptyWFSFeatureSelections(layer);
            });
        },
        /**
         * @method setSelectFromAllLayers
         * @param {boolean} selectAll; true if the selection is wanted to be done from all layers and false if not
         *
         * sets the selection mode so that selection is made from all layers on the map
         */
        setSelectFromAllLayers: function (selectAll) {
            var me = this;

            me.selectFromAllLayers = selectAll;
        },
        /**
         * @method isSelectFromAllLayers
         *
         * @return {boolean} me.selectFromAllLayers
         *
         * Tells weather the selection is made from all layers or not
         */
        isSelectFromAllLayers: function () {
            return this.selectFromAllLayers;
        },
        /**
         * @method setSelectionToolsActive
         * @param {boolean} selectionToolsActive; one or more of the selection tools is active -> gfi not allowed, not even by accident...
         *
         */
        setSelectionToolsActive: function (selectionToolsActive) {
            var me = this;
            me.selectionToolsActive = selectionToolsActive;
        },
        /**
         * @method selectionToolsActive
         *
         * @return {boolean} me.selectionToolsActive
         *
         * Tells the mediator that raising the mapclick is a no-no, because the selection tools are active.
         */
        isSelectionToolsActive: function () {
            return this.selectionToolsActive;
        },

        getAnalysisWFSLayerId: function () {
            return this.analysisWFSLayerId;
        },
        setAnalysisWFSLayerId: function (layerId) {
            this.analysisWFSLayerId = layerId;
        }
    });
