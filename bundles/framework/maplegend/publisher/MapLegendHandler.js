
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (initialData, sandbox, tool) {
        super();
        this.tool = tool;
        this.sandbox = sandbox;
        this.setState({
            showLegends: initialData || false
        });
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'MapLegendHandler';
    }

    isDisplayed () {
        return this.sandbox.findAllSelectedMapLayers().some(l => l.getLegendImage());
    }

    setShowLegends (value) {
        this.updateState({
            showLegends: value
        });
        if (value === false) {
            this.tool.setEnabled(false);
        } else {
            this.tool.setEnabled(true);
        }
    }

    createEventHandlers () {
        const handlers = {
            AfterMapLayerAddEvent: function (event) {
                const displayed = this.isDisplayed();
                if (!displayed) {
                    this.setShowLegends(false);
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                const displayed = this.isDisplayed();
                if (!displayed) {
                    this.setShowLegends(false);
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setShowLegends',
    'isDisplayed'
]);

export { wrapped as MapLegendHandler };
