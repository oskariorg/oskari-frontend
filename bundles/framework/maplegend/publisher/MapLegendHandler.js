
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (initialData, tool) {
        super();
        this.tool = tool;
        this.sandbox = tool.getSandbox();
        this.setState({
            showLegends: initialData || false,
            isDisabled: this.hasNoLayersWithLegend()
        });
        // TODO: we should tear down these handlers when exiting publisher
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'MapLegendHandler';
    }

    hasNoLayersWithLegend () {
        return this.tool.isDisabled();
    }

    handleLayersChanged () {
        const toolShouldBeDisabled = this.hasNoLayersWithLegend();
        const { isDisabled } = this.getState();
        if (!isDisabled && this.hasNoLayersWithLegend()) {
            this.setShowLegends(false);
        }
        else if (isDisabled !== toolShouldBeDisabled) {
            this.updateState({
                isDisabled: toolShouldBeDisabled
            });
        }
    }

    setShowLegends (value) {
        const bool = !!value;
        this.updateState({
            showLegends: bool,
            isDisabled: this.hasNoLayersWithLegend()
        });
        this.tool.setEnabled(bool);
    }

    createEventHandlers () {
        const handlers = {
            AfterMapLayerAddEvent: function () {
                this.handleLayersChanged();
            },
            AfterMapLayerRemoveEvent: function () {
                this.handleLayersChanged();
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
    'setShowLegends'
]);

export { wrapped as MapLegendHandler };
