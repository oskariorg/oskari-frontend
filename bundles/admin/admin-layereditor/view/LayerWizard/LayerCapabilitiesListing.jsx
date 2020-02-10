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
export const StylePopLi = styled.li`
overflow: hidden;
text-overflow: ellipsis;
`;

export const LayerCapabilitiesListing = ({ capabilities = {}, onSelect = () => {} }) => {
    const [filter, setfilter] = useState('');
    const allLayers = prepareData(capabilities);
    const layers = sortLayers(filterLayers(allLayers, filter));
    return (
        <React.Fragment>
            <LayerCapabilitiesFilter
                placeholder="Filter layers"
                filter={filter}
                onChange={(value) => setfilter(value)}/>
            <List dataSource={layers} rowKey="name" renderItem={item => getItem(onSelect, item)}></List>
        </React.Fragment>);
};

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.object,
    onSelect: PropTypes.func
};

/**
 * Processes a layer list to be rendered based on capabilities
 * @param {Object} capabilities
 * @returns array of objects for rendering and including the original layer data
 */
const prepareData = (capabilities) => {
    // init empty fields for possibly missing information
    const data = {
        layersWithErrors: [],
        unsupportedLayers: [],
        existingLayers: {},
        ...capabilities
    };
    return Object.values(data.layers).map(layer => {
        return {
            title: layer.locale[Oskari.getLang()].name,
            name: layer.name,
            isProblematic: !!data.layersWithErrors.includes(layer.name),
            isUnsupported: !!data.unsupportedLayers.includes(layer.name),
            isExisting: !!data.existingLayers[layer.name],
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

// FIXME: this isn't working properly but first decide how we want to sort existing/problematic etc layers
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

// FIXME: this is dummy content to show tech details/for debugging
const generateContent = (item) => (
    <StylePopUl>
        <StylePopLi>Exists: {'' + item.isExisting}</StylePopLi>
        <StylePopLi>Problematic: {'' + item.isProblematic}</StylePopLi>
        <StylePopLi>Unsupported: {'' + item.isUnsupported}</StylePopLi>
        <StylePopLi>{JSON.stringify(item.layer)}</StylePopLi>
    </StylePopUl>

);
