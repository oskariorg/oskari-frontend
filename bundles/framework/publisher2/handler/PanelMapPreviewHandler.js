import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { PUBLISHER_BUNDLE_ID } from '../view/PublisherSideBarHandler';

export const CUSTOM_MAP_SIZE_ID = 'custom';
const MAP_SIZE_FILL_ID = 'fill';
export const MAP_SIZES = [{
    id: MAP_SIZE_FILL_ID,
    width: '',
    height: '',
    selected: true, // default option
    valid: true
}, {
    id: 'small',
    width: 580,
    height: 387,
    valid: true
}, {
    id: 'medium',
    width: 700,
    height: 600,
    valid: true
}, {
    id: 'large',
    width: 1240,
    height: 700,
    valid: true
}, {
    id: CUSTOM_MAP_SIZE_ID,
    valid: true
}];

export const CUSTOM_MAP_SIZE_LIMITS = {
    minWidth: 30,
    minHeight: 20,
    maxWidth: 4000,
    maxHeight: 2000
};

class UIHandler extends StateHandler {
    constructor () {
        super();
        this.mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        this.state = {
            id: MAP_SIZE_FILL_ID
        };
    }

    init (data) {
        const selectedId = data?.metadata?.preview || MAP_SIZE_FILL_ID;
        const selectedMapSize = MAP_SIZES.find(size => size.id === selectedId);
        if (selectedId === CUSTOM_MAP_SIZE_ID) {
            selectedMapSize.width = data?.metadata?.size?.width || '';
            selectedMapSize.height = data?.metadata?.size?.height || '';
        }
        this.updateMapSize(selectedMapSize);
    }

    updateMapSize (mapSize) {
        this.updateState({
            ...mapSize
        });
        if (mapSize.valid) {
            this.adjustDataContainer();
        }
    }

    /**
     * @method adjustDataContainer
     * This horrific thing is what sets the left panel components, container and map size.
     */
    adjustDataContainer () {
        const selectedSize = this.getSelectedMapSize();
        const size = selectedSize.valid ? selectedSize : this.getActiveMapSize();

        const mapDiv = this.mapmodule.getMapEl();
        mapDiv.width(size.width || '100%');
        mapDiv.height(size.height || '100%');
    }

    /**
     * @private @method getActiveMapSize
     * Returns an object containing the active map size.
     * This will differ from selected size if selected size is invalid.
     *
     * @return {Object} size
     */
    getActiveMapSize () {
        const mapDiv = this.mapmodule.getMapEl();
        return {
            width: mapDiv.width(),
            height: mapDiv.height()
        };
    }

    /**
    * Stop panel.
    * @method stop
    * @public
    **/
    stop () {
        // restore "fill" as default size setting
        this.updateMapSize(MAP_SIZES.find(size => size.id === MAP_SIZE_FILL_ID));

        window.setTimeout(() => {
            // calculate new sizes AFTER the publisher panel has been removed from page
            // otherwise the publisher panel that we have while stopping is taking up space
            // from the map and the map size is calculated wrong
            this.adjustDataContainer();
        }, 200);
    }

    getValues () {
        const selected = this.getSelectedMapSize();
        const values = {
            metadata: {
                preview: selected.id
            }
        };

        if (!isNaN(parseInt(selected.width)) && !isNaN(parseInt(selected.height))) {
            values.metadata.size = {
                width: selected.width,
                height: selected.height
            };
        }
        return values;
    }

    validate () {
        const errors = [];
        if (!this.getSelectedMapSize().valid) {
            errors.push({
                field: 'size',
                error: Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.error.size', CUSTOM_MAP_SIZE_LIMITS)
            });
        }
        return errors;
    }

    /**
     * @private @method getSelectedMapSize
     * Returns an object containing the user seleted/set map size and the corresponding size option
     *
     * @return {Object} size
     */
    getSelectedMapSize () {
        return {
            ...this.state
        };
    }
}

const wrapped = controllerMixin(UIHandler, [
    'validate',
    'getValues',
    'getSelectedMapSize',
    'updateMapSize'
]);

export { wrapped as PanelMapPreviewHandler };
