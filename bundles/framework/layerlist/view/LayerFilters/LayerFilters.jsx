import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LayerFilter } from './LayerFilter/LayerFilter';
import styled from 'styled-components';

const StyledFilters = styled.div`
    margin: 10px;
    color: #949494;
    display: flex;
`;

export const LayerFilters = ({ layerListRenderHandler }) => {
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
                    const filterButton =
                        <LayerFilter key={button.properties.id} text={button.properties.text}
                            tooltip={button.properties.tooltip} filterName = {button.filterId}
                            classNameDeactive = {button.properties.cls.deactive}
                            clickHandler={(event) => {
                                const filterName = event.target.attributes.filtername || event.target.parentElement.attributes.filtername;
                                const filter = filterName.value;
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
                        </LayerFilter>
                    return [...buttons, filterButton];
                } else {
                    return buttons;
                }
            });
        });
    });
    return (
        <StyledFilters>
            {buttons}
        </StyledFilters>
    );
};

LayerFilters.propTypes = {
    layerListRenderHandler: PropTypes.func.isRequired
};
