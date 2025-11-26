
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import './request/ShowContentEditorRequest';
import './request/ShowContentEditorRequestHandler';
import './view/SideContentEditor';
import { MYFEATURES_CONTENTEDITOR_BUNDLE_NAME } from './constants';
const MYFEATURES_LAYERID_PREFIX = 'myf_';

export class MyFeaturesContentEditorBundleInstance extends BasicBundleInstance {
    constructor() {
        super(MYFEATURES_CONTENTEDITOR_BUNDLE_NAME);
        this._sandbox = Oskari.getSandbox();
        this.plugins = {};
        this.sideContentEditor = null;
        this.eventHandlers = {
            FeatureEvent: function (event) {
                if (this.sideContentEditor == null || event.getOperation() !== 'click') {
                    return;
                }
                const currentLayer = this.sideContentEditor.getCurrentLayer().id;
                const editLayerFeatures = event.getFeatures().filter(f => f.layerId === currentLayer);
                if (!editLayerFeatures.length) {
                    // no features hit on layer that we are currently editing
                    return;
                }
                // found one -> edit it
                this.sideContentEditor.editFeature(editLayerFeatures[0].geojson.features[0]);
            },
            MapLayerEvent: function (event) {
                // adds edit tool for new layers
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                if (event.getLayerId()) {
                    this.addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this.setupLayerTools();
                }
            }
        };
    }

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    start () {
        this.getSandbox().register(this);


        Object.keys(this.eventHandlers).forEach(eventName => {
            this.getSandbox().registerForEventByName(this, eventName);
        });

        // Let's extend UI
        this.getSandbox().request(this, Oskari.requestBuilder('userinterface.AddExtensionRequest')(this));

        // create request handlers

        this.showContentEditorRequestHandler = Oskari.clazz.create(
            'Oskari.bundles.framework.myfeatures-content-editor.request.ShowContentEditorRequestHandler',
            this
        );

        // register request handlers
        this.getSandbox().requestHandler('ContentEditor.ShowContentEditorRequest', this.showContentEditorRequestHandler);
        this.setupLayerTools();

    }

    /**
     * Adds tools for all layers
     */
    setupLayerTools () {
        // add tools for feature data layers
        const service = this.getLayerService();
        const layers = service.getAllLayers();

        // probably should filter here and not call addTool for _every_ layer in layers
        layers.forEach((layer) => this.addTool(layer, true));
        // update all layers at once since we suppressed individual events
        const event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
        this.getSandbox().notifyAll(event);
    }

    isMyFeaturesLayer(layerModel) {
        return layerModel?.getId()?.toString()?.indexOf(MYFEATURES_LAYERID_PREFIX) > -1;

    }

    /**
     * Adds the Feature data tool for layer
     * @param  {String| Number} layerId layer to process
     * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
     */
    addTool (layerModel, suppressEvent) {
        const service = this.getLayerService();
        if (typeof layerModel !== 'object') {
            // detect layerId and replace with the corresponding layerModel
            layerModel = service.findMapLayer(layerModel);
        }
        if ((!layerModel ||
            !layerModel.hasPermission('EDIT_LAYER_CONTENT') ||
            !layerModel.isLayerOfType('WFS')) &&
            !this.isMyFeaturesLayer(layerModel)) {
            return;
        }

        // add feature data tool for layer
        const label = this.getTitle() || {};
        const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
        tool.setName('content-editor');
        tool.setTitle(label);
        tool.setIconCls('show-content-editor-tool');
        tool.setTooltip(label);

        const sb = this.getSandbox();
        tool.setCallback(function () {
            sb.postRequestByName('ContentEditor.ShowContentEditorRequest', [layerModel.getId()]);
        });

        service.addToolForLayer(layerModel, tool, suppressEvent);
    }

    /**
     * Fetches reference to the map layer service
     * @return {Oskari.mapframework.service.MapLayerService}
     */
    getLayerService () {
        return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
    }

    showContentEditor (layerId) {
        // trigger an event letting other bundles know we require the whole UI
        const eventBuilder = Oskari.eventBuilder('UIChangeEvent');
        this.getSandbox().notifyAll(eventBuilder(this.mediator.bundleId));
        this.setEditorMode(true, layerId);
    }

    /**
     * @method setEditorMode
     *
     * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
     * @param {string} layerId
     */
    setEditorMode (blnEnabled, layerId) {
        const mapElement = document.getElementById('contentMap');
        const sandbox = this.getSandbox();
        const additionalClass = 'mapContentEditorMode';
        if (blnEnabled) {
            mapElement.classList.add(additionalClass); //addClass('mapContentEditorMode');
            const myRoot = document.createElement('div');
            mapElement.appendChild(myRoot);
            this.sideContentEditor = Oskari.clazz.create(
                'Oskari.bundles.framework.myfeatures-content-editor.view.SideContentEditor',
                sandbox,
                layerId,
                () => this.setEditorMode(false)
            );
            this.sideContentEditor.render(myRoot);
        } else {
            if (this.sideContentEditor) {
                this.sideContentEditor.destroy();
            }
            mapElement.classList.remove(additionalClass); //removeClass('mapContentEditorMode');

            const request = Oskari.requestBuilder('userinterface.UpdateExtensionRequest')(this, 'close', this.getName());
            sandbox.request(this.getName(), request);
        }

        sandbox.postRequestByName('MapFull.MapSizeUpdateRequest', []);
    }

    /**
     * @method stop
     * Implements BundleInstance protocol stop method
     */
    stop () {
        const sandbox = this.getSandbox();
        Object.keys(this.eventHandlers)
            .forEach(eventName => sandbox.unregisterFromEventByName(this, eventName));
        sandbox.request(this, Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this));
        sandbox.unregister(this);
    }

    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     */
    startExtension () {

    }

    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     * Clears references to flyout
     */
    stopExtension () {

    }

    /**
     * @method getPlugins
     * implements Oskari.userinterface.Extension protocol getPlugins method
     * @return {Object} references to flyout
     */
    getPlugins () {
        return this.plugins;
    }

    /**
     * @method getTitle
     * @return {String} localized text for the title of the component
     */
    getTitle () {
        return this.loc('title');
    }

    /**
     * @method getDescription
     * @return {String} localized text for the description of the component
     */
    getDescription () {
        return this.loc('desc');
    }

}
