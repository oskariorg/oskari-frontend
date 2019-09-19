import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FilterButton } from './FilterButton/FilterButton';

export const FilterButtons = ({ layerListRenderHandler }) => {
    const layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
    const mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
    const [buttons, addButton] = useState([]);
    // TODO: Fix currentFilter setting through state.
    // const [currentFilter, setFilter] = useState('');
    var currentFilter = '';
    useEffect(() => {
        layerlistService.on('Layerlist.Filter.Button.Add', (button) => {
            addButton(buttons => {
                const buttonCreated = buttons.filter(b => b.key === button.properties.id).length > 0;
                if (!buttonCreated) {
                    const filterButton = <FilterButton key={button.properties.id} text={button.properties.text}
                        tooltip={button.properties.tooltip} filterName = {button.filterId}
                        clickHandler={(event) => {
                            const filter = event.target.attributes.filtername.value;
                            var layers;
                            if (currentFilter !== filter) {
                                layers = mapLayerService.getFilteredLayers(filter);
                            } else if (currentFilter === filter) {
                                layers = mapLayerService.getAllLayers();
                            }
                            // setFilter(filter);
                            currentFilter = filter;
                            const layersCopy = layers.slice(0);
                            layerListRenderHandler(layersCopy);
                        }}>
                    </FilterButton>
                    return [...buttons, filterButton];
                } else {
                    return buttons;
                }
            });
        });
    });
    return (
        <div>
            {buttons}
        </div>
    );
};

FilterButtons.propTypes = {
    layerListRenderHandler: PropTypes.func.isRequired
};
