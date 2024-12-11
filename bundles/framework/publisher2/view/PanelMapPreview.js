import React from 'react';
import { PropTypes } from 'prop-types';
import { CUSTOM_MAP_SIZE_ID, MapPreviewForm, MapPreviewTooltip } from './form/MapPreviewForm';

const MAP_SIZE_FILL_ID = 'fill';
const MAP_SIZES = [{
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

export const PANEL_MAPPREVIEW_ID = 'panelMapPreview';
export class PanelMapPreview extends React.Component {
    constructor (props) {
        super(props);
        const { localization, data } = props;
        this.localization = localization;
        this.data = data;
        this.mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        this.eventHandlers = {
            MapSizeChangedEvent: function () {
                // update map / container size but prevent a new mapsizechanged request from being sent
                this.updateMapSize();
            }
        };

        this.registerEventHandlers();
        this.initMapSize();
    }

    initMapSize () {
        const selection = this.data?.metadata
            ? {
                id: this.data?.metadata?.preview,
                width: this.data?.metadata?.size?.width || null,
                height: this.data?.metadata?.size?.height || null
            }
            : null;

        this.selectedMapSize = selection && selection.id ? MAP_SIZES.find(size => size.id === selection.id) : MAP_SIZES.find(size => size.id === MAP_SIZE_FILL_ID);
        this.updateMapSize();
    }

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    getName () {
        return 'Oskari.mapframework.bundle.publisher2.view.PanelMapPreview';
    }

    registerEventHandlers () {
        const sandbox = Oskari.getSandbox();
        for (const p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(this, p);
            }
        }
    }

    unregisterEventHandlers () {
        const sandbox = Oskari.getSandbox();
        for (const p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }
    }

    getId () {
        return PANEL_MAPPREVIEW_ID;
    }

    getLabel () {
        return this.localization?.size?.label || '';
    }

    render () {
        return <>
            <MapPreviewTooltip/>
            <MapPreviewForm
                onChange={(value) => { this.mapSizeSelectionChanged(value); }}
                mapSizeOptions={MAP_SIZES}
                initialSelection={this.selectedMapSize || null}/>
        </>;
    }

    mapSizeSelectionChanged (mapSize) {
        this.selectedMapSize = mapSize;
        if (this.selectedMapSize.valid) {
            this.updateMapSize();
        }
    }

    /**
     * @public @method updateMapSize
     * Adjusts the map size according to publisher selection
     *
     */
    updateMapSize () {
        this.adjustDataContainer();
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
        this.mapSizeSelectionChanged(MAP_SIZES.find(size => size.id === MAP_SIZE_FILL_ID));
        this.unregisterEventHandlers();

        window.setTimeout(() => {
            // calculate new sizes AFTER the publisher panel has been removed from page
            // otherwise the publisher panel that we have while stopping is taking up space
            // from the map and the map size is calculated wrong
            this.adjustDataContainer(true);
        }, 200);
    }

    /**
     * Returns the selections the user has done with the form inputs.
     * {
     *     domain : <domain field value>,
     *     name : <name field value>,
     *     language : <language user selected>
     * }
     *
     * @method getValues
     * @return {Object}
     */
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
                error: Oskari.getMsg('Publisher2', 'BasicView.error.size', this.sizeLimits)
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
        return this.selectedMapSize;
    }
}

PanelMapPreview.propTypes = {
    data: PropTypes.object,
    localization: PropTypes.object
};
