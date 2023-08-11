import { StateHandler, controllerMixin } from 'oskari-ui/util';

class Handler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.setState({
            styles: [], // layer related styles
            loading: false
        });
        this.service = this.instance.getService();
        this.bindEvents();
    };

    getName () {
        return 'UserStyleHandler';
    }

    bindEvents () {
        this.service.on('update', () => this.updateStyleList());
        this.service.on('ajax', (loading) => this.updateState({ loading }));
        this.sandbox.registerForEventByName(this, 'MapLayerEvent');
    }

    // listens MapLayerEvent only
    onEvent (event) {
        // update style list on add layers (on startup)
        if (event.getOperation() === 'add' && !event.getLayerId()) {
            this.updateStyleList();
        }
    }

    updateStyleList () {
        const stylesByLayerId = {};
        this.service.getStyles().forEach(style => {
            const { layerId } = style;
            const added = stylesByLayerId[layerId];
            if (!added) {
                const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
                stylesByLayerId[layerId] = {
                    layer: layer?.getName(),
                    ...style
                };
                return;
            }
            // layer has more than one style
            if (added.count) {
                added.count = added.count + 1;
            } else {
                // store only common values for style collection
                stylesByLayerId[layerId] = {
                    layerId: added.layerId,
                    layer: added.layer,
                    count: 2
                };
            }
        });
        this.updateState({
            styles: Object.values(stylesByLayerId),
            loading: false
        });
    }

    deleteStyle (id) {
        this.service.removeUserStyle(id);
    }

    showStyleEditor (id) {
        this.sandbox.postRequestByName('ShowUserStylesRequest', [{ id }]);
    }

    addLayerToMap (layerId, styleId) {
        const styleName = styleId?.toString();
        if (this.sandbox.isLayerAlreadySelected(layerId)) {
            if (styleName) {
                // use request to trigger event
                this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, styleName]);
            }
            return;
        }
        if (styleName) {
            // AddMapLayerRequest is asynchoronous so style has to be selected before request
            // ChangeMapLayerStyleRequest doesn't work properly as layer isn't selected immediately
            this.sandbox.findMapLayerFromAllAvailable(layerId)?.selectStyle(styleName);
        }
        this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
    }

    showLayerStyles (layerId) {
        this.sandbox.postRequestByName('ShowUserStylesRequest', [{ layerId }]);
    }
}

export const UserStyleHandler = controllerMixin(Handler, [
    'deleteStyle',
    'showStyleEditor',
    'addLayerToMap',
    'showLayerStyles'
]);
