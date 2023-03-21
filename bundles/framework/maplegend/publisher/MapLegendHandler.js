
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
    };

    getName () {
        return 'MapLegendHandler';
    }

    hasNoLayersWithLegend () {
        return this.tool.isDisabled();
    }

    onLayersChanged () {
        // this is called by publisher/MapLayersHandler when an Oskari event regarding layers has happened
        this.handleLayersChanged();
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
}

const wrapped = controllerMixin(UIHandler, [
    'setShowLegends'
]);

export { wrapped as MapLegendHandler };
