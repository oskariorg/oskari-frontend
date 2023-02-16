
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (initialData, sandbox, tool) {
        super();
        this.tool = tool;
        this.sandbox = sandbox;
        this.setState({
            showLegends: initialData || false
        });
    };

    getName () {
        return 'MapLegendHandler';
    }

    isDisplayed () {
        const displayed = this.sandbox.findAllSelectedMapLayers().some(l => l.getLegendImage());
        if (!displayed) {
            this.setShowLegends(false);
        }
        return displayed;
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
}

const wrapped = controllerMixin(UIHandler, [
    'setShowLegends',
    'isDisplayed'
]);

export { wrapped as MapLegendHandler };
