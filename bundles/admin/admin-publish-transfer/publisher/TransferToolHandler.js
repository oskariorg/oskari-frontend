import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showTransferPopup } from './TransferPopup';

class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;
    };

    showPopup () {
        if (this.popupControls) {
            this.popupControls.close();
            return;
        }
        this.popupControls = showTransferPopup(this.state, this.controller, () => this.closePopup());
    }

    closePopup () {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;
    }
}

const wrapped = controllerMixin(UIHandler, [
    'showPopup'
]);

export { wrapped as TransferToolHandler };
