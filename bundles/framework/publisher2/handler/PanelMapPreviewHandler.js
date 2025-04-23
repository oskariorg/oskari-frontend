import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { PUBLISHER_BUNDLE_ID } from '../view/PublisherSideBarHandler';

export const CUSTOM_MAP_SIZE = 'custom';
const DEFAULT_MAP_SIZE = 'fill';
export const MAP_SIZES = [{
    value: 'fill'
}, {
    value: 'small',
    width: 580,
    height: 387
}, {
    value: 'medium',
    width: 700,
    height: 600
}, {
    value: 'large',
    width: 1240,
    height: 700
}, {
    value: CUSTOM_MAP_SIZE
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
            preview: DEFAULT_MAP_SIZE,
            customSize: {},
            errors: []
        };
    }

    init (data) {
        if (!data?.metadata) {
            return;
        }
        const { preview: stored, size = {} } = data.metadata;
        // use default size if stored preview size isn't in options (e.g. 'desktop')
        const preview = MAP_SIZES.find(opt => opt.value === stored)?.value || DEFAULT_MAP_SIZE;
        if (preview === CUSTOM_MAP_SIZE) {
            this.updateState({ customSize: size });
        }
        // use set preview to adjust map size
        this.setPreview(preview);
    }

    setPreview (preview) {
        const { value, ...size } = MAP_SIZES.find(opt => opt.value === preview) || {};
        if (!value) {
            return;
        }
        this.updateState({ preview });
        if (preview === CUSTOM_MAP_SIZE) {
            // use setter to validate values
            this.setCustomSize(this.getState().customSize);
            return;
        }
        this.adjustMapSize(size);
    }

    setCustomSize (customSize) {
        const errors = this.validateSize(customSize);
        this.updateState({ customSize, errors });
        if (!errors.length) {
            this.adjustMapSize(customSize);
        }
    }

    adjustMapSize (size) {
        this.mapmodule.setMapSize(size);
    }

    validateSize ({ width, height }) {
        const errors = [];
        if (!width || width < CUSTOM_MAP_SIZE_LIMITS.minWidth || width > CUSTOM_MAP_SIZE_LIMITS.maxWidth) {
            errors.push('width');
        }
        if (!height || height < CUSTOM_MAP_SIZE_LIMITS.minHeight || height > CUSTOM_MAP_SIZE_LIMITS.maxHeight) {
            errors.push('height');
        }
        return errors;
    }

    /**
    * Stop panel.
    * @method stop
    * @public
    **/
    stop () {
        // TODO: this should be handled on publisher close (instance, publisher,..) not on panel remove
        window.setTimeout(() => {
            // calculate new sizes AFTER the publisher panel has been removed from page
            // otherwise the publisher panel that we have while stopping is taking up space
            // from the map and the map size is calculated wrong
            this.adjustMapSize();
        }, 200);
    }

    getValues () {
        const { customSize, preview } = this.getState();
        const metadata = { preview };
        if (preview === CUSTOM_MAP_SIZE) {
            metadata.size = customSize;
        } else {
            const { width, height } = MAP_SIZES.find(opt => opt.value === preview) || {};
            if (width && height) {
                metadata.size = { width, height };
            }
        }
        return { metadata };
    }

    validate () {
        const { errors, preview } = this.getState();
        if (preview === CUSTOM_MAP_SIZE && errors.length) {
            return [{
                field: 'size',
                error: Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.error.size', CUSTOM_MAP_SIZE_LIMITS)
            }];
        }
        return [];
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setPreview',
    'setCustomSize'
]);

export { wrapped as PanelMapPreviewHandler };
