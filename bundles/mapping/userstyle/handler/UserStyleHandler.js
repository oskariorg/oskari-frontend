import { StateHandler, controllerMixin } from 'oskari-ui/util';

class Handler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.setState({
            styles: [],
            loading: false
        });
        this.service = this.instance.getService();
        this.bindEvents();
    };

    getName () {
        return 'UserStylesHandler';
    }

    bindEvents () {
        this.service.on('update', () => this.updateStyleList());
        this.service.on('ajax', () => this.updateState({ loading: true }));
    }

    updateStyleList () {
        const styles = this.service.getStyles()
            .map(style => {
                const layer = this.sandbox.findMapLayerFromAllAvailable(style.layerId);
                return {
                    layer: layer?.getName(),
                    ...style
                };
            });
        this.updateState({
            styles,
            loading: false
        });
    }

    deleteStyle (id) {
        this.service.removeUserStyle(id);
    }

    showStyleEditor (id) {
        this.getSandbox().postRequestByName('ShowUserStylesRequest', [{ id }]);
    }
}

export const UserStyleHandler = controllerMixin(Handler, [
    'deleteStyle',
    'showStyleEditor'
]);
