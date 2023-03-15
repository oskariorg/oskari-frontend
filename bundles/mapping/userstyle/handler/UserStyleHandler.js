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
        this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
        if (styleId) {
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, styleId]);
        }
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
