import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Popover } from 'oskari-ui';
import { LayerCapabilitiesFilter } from './LayerCapabilitiesFilter';

export const StyledListItem = styled(ListItem)`
:hover {
    color: white;
    background-color: palevioletred;
}

${({ item }) => item.isExisting && `
background-color: palegreen;
`}
${({ item }) => item.isProblematic && `
background-color: orange;
`}
${({ item }) => item.isUnsupported && `
background-color: lightcoral;
`}
`;
export const StylePopUl = styled.ul`
max-width: 400px;
`;

const compare = (a, b, next) => {
    if (a && b) {
        return 1;
    }
    if (!a && !b) {
        return -1;
    }
    if (next) {
        return next();
    }
    return 0;
};

export const LayerCapabilitiesListing = (props) => {
    const [filter, setfilter] = useState('');
    const allLayers = prepareData(props.capabilities);
    const layers = sortLayers(filterLayers(allLayers, filter));
    return (
        <React.Fragment>
            <LayerCapabilitiesFilter
                filter={filter}
                onChange={(value) => setfilter(value)}/>
            <List dataSource={layers} rowKey="name" renderItem={item => getItem(props.onSelect, item)}></List>
        </React.Fragment>);
};

/**
 * Processes a layer list to be rendered based on capabilities
 * @param {Object} capabilities
 * @returns array of objects for rendering and including the original layer data
 */
const prepareData = (capabilities) => {
    return Object.values(capabilities.layers).map(layer => {
        return {
            title: layer.locale[Oskari.getLang()].name,
            name: layer.name,
            isProblematic: !!capabilities.layersWithErrors.includes(layer.name),
            isUnsupported: !!capabilities.unsupportedLayers.includes(layer.name),
            isExisting: !!capabilities.existingLayers.includes(layer.name),
            layer
        };
    });
};

const sortLayers = (layers) => {
    return layers.sort((a, b) => {
        return compare(a.isExisting, !b.isExisting,
            () => compare(a.isProblematic, !b.isProblematic,
                () => Oskari.util.naturalSort(a, b)));
    });
};

/**
 * Splits filter from spaces and returns all layers where name and/or title has all the parts of the filter
 * @param {Array} layers array of objects with name and title keys
 * @param {String} filter string to use for filtering layers
 */
const filterLayers = (layers, filter) => {
    if (!filter) {
        return layers;
    }
    let filterLower = filter.toLowerCase().split(' ');
    return layers.filter((layer) => {
        return filterLower.map((item) => {
            return layer.name.toLowerCase().includes(item) ||
                layer.title.toLowerCase().includes(item);
        }).every((item) => item === true);
    });
};

const getItem = (onSelect, item) => {
    return (
        <Popover content={generateContent(item)} title={item.title} placement="right">
            <StyledListItem onClick={() => onSelect(item.layer)} item={item}>
                {item.layer.name} / {item.title}
            </StyledListItem>
        </Popover>
    );
};

const generateContent = (item) => (
    <StylePopUl>
        <li>Exists: {'' + item.isExisting}</li>
        <li>Problematic: {'' + item.isProblematic}</li>
        <li>Unsupported: {'' + item.isUnsupported}</li>
        <li>{JSON.stringify(item.layer)}</li>
    </StylePopUl>

);

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.object,
    onSelect: PropTypes.func
};
