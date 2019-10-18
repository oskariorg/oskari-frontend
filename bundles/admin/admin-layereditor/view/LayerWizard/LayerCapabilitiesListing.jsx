import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Popover } from 'oskari-ui';
import styled from 'styled-components';

export const StyledListItem = styled(ListItem)`
:hover {
    color: white;
    background-color: palevioletred;
}

${({ item }) => item.isExisting && `
background-color: lime;
`}
${({ item }) => item.isProblematic && `
background-color: orange;
`}
${({ item }) => item.isUnsupported && `
background-color: red;
`}
`;

export const LayerCapabilitiesListing = (props) => {
    const layers = prepareData(props.capabilities).sort((a, b) => {
        if (a.isExisting && !b.isExisting) {
            return -1;
        }
        if (a.isProblematic && !b.isProblematic) {
            return -1;
        }
        return Oskari.util.naturalSort(a, b);
    }).reverse();
    return (<List dataSource={layers} rowKey="name" renderItem={item => getItem(props.onSelect, item)}></List>);
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
            isProblematic: !!capabilities.layersWithErrors.includes(layer.name),
            isUnsupported: !!capabilities.unsupportedLayers.includes(layer.name),
            isExisting: !!capabilities.existingLayers.includes(layer.name),
            layer
        };
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
    <ul>
        <li>Exists: {'' + item.isExisting}</li>
        <li>Problematic: {'' + item.isProblematic}</li>
        <li>Unsupported: {'' + item.isUnsupported}</li>
    </ul>

);

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.object,
    onSelect: PropTypes.func
};
