import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Tooltip, Message, Confirm, Button } from 'oskari-ui';

import { LocaleConsumer } from 'oskari-ui/util';
import { LayerCapabilitiesFilter } from './LayerCapabilitiesFilter';
import { CheckCircleTwoTone, QuestionCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

const LOCALIZATION_BUNDLE_ID = 'admin-layereditor';

export const StyledListItem = styled(ListItem)`
    :hover {
        background-color: #ffd400;
    }
`;
export const StylePopUl = styled.ul`
    max-width: 400px;
`;
export const StylePopLi = styled.li`
    overflow: hidden;
    text-overflow: ellipsis;
`;

const PaddedItemContainer = styled('div')`
    margin-left: ${props => props.depth}vw;
`;

const ToggleButton = styled(Button)`
    margin: 1vh 0;
`;

const LayerCapabilitiesListing = ({ capabilities = {}, onSelect = () => {}, getMessage }) => {
    const [filter, setfilter] = useState('');
    const [treeView, setTreeview] = useState(false);
    const canHaveTreeView = !!capabilities?.structure;
    const allLayers = prepareData(capabilities);
    const layers = sortLayers(filterLayers(allLayers, filter));

    if (treeView) {
        return (
            <React.Fragment>
                { canHaveTreeView &&
                <ToggleButton type={'primary'} onClick={() => setTreeview(!treeView)}>
                    <Message bundleKey={LOCALIZATION_BUNDLE_ID} messageKey={'wizard.toggleFlatView'}/>
                </ToggleButton>
                }
                <LayerCapabilitiesTreeView capabilities={capabilities} onSelect={onSelect} getMessage={getMessage}/>
            </React.Fragment>);
    }
    return (
        <React.Fragment>
            <LayerCapabilitiesFilter
                placeholder="Filter layers"
                filter={filter}
                onChange={(value) => setfilter(value)}/>
            { canHaveTreeView &&
                <ToggleButton type={'primary'} onClick={() => setTreeview(!treeView)}>
                    <Message bundleKey={LOCALIZATION_BUNDLE_ID} messageKey={'wizard.toggleTreeView'}/>
                </ToggleButton>
            }
            <List dataSource={layers} rowKey="name" renderItem={item => getItem(onSelect, item, getMessage)}></List>
        </React.Fragment>);
};

LayerCapabilitiesListing.propTypes = {
    capabilities: PropTypes.object,
    getMessage: PropTypes.func.isRequired,
    onSelect: PropTypes.func
};

const renderStructureItem = (structureItem, allLayers, depth, onSelect, getMessage) => {
    const layer = allLayers?.find(layer => layer?.name === structureItem?.name) || null;
    return (
        <PaddedItemContainer key={structureItem.name} depth={depth}>
            { getItem(onSelect, layer, getMessage) }
            { structureItem?.structure?.map(nestedStructureItem => renderStructureItem(nestedStructureItem, allLayers, depth + 1, onSelect, getMessage)) }
        </PaddedItemContainer>
    );
};

const LayerCapabilitiesTreeView = ({ capabilities = {}, onSelect = () => {}, getMessage }) => {
    const allLayers = prepareData(capabilities);
    const { structure } = capabilities;
    return (
        <React.Fragment>
            { structure.map(structureItem => renderStructureItem(structureItem, allLayers, 0, onSelect, getMessage))}
        </React.Fragment>);
};

LayerCapabilitiesTreeView.propTypes = {
    capabilities: PropTypes.object,
    getMessage: PropTypes.func.isRequired,
    onSelect: PropTypes.func
};

const contextWrap = LocaleConsumer(LayerCapabilitiesListing);
export { contextWrap as LayerCapabilitiesListing };

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
    const existing = layers.filter(l => l.isExisting);
    const problematic = layers.filter(l => !l.isExisting && l.isProblematic);
    const available = layers.filter(l => !existing.includes(l) && !problematic.includes(l));
    available.sort((a, b) => Oskari.util.naturalSort(a.title, b.title));
    problematic.sort((a, b) => Oskari.util.naturalSort(a.title, b.title));
    existing.sort((a, b) => Oskari.util.naturalSort(a.title, b.title));
    return [...available, ...problematic, ...existing];
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
    const filterLower = filter.toLowerCase().split(' ');
    return layers.filter((layer) => {
        return filterLower.map((item) => {
            return layer.name.toLowerCase().includes(item) ||
                layer.title.toLowerCase().includes(item);
        }).every((item) => item === true);
    });
};

const getItem = (onSelect, item, getMessage) => {
    if (item.isExisting) {
        return (<Confirm
            title={<Message messageKey='messages.confirmDuplicatedLayer'/>}
            onConfirm={() => onSelect(item.layer)}
            okText={getMessage('ok')}
            cancelText={getMessage('cancel')}
        >
            <StyledListItem item={item}>
                {item.layer.name} / {item.title} {getIcon(item)}
            </StyledListItem>
        </Confirm>);
    }
    return (
        <StyledListItem onClick={() => onSelect(item.layer)} item={item}>
            {item.layer.name} / {item.title} {getIcon(item)}
        </StyledListItem>
    );
};

const getIcon = (item) => {
    // <Tooltip title={message}>
    if (item.isExisting) {
        return (<Tooltip title={<Message key={item.name} messageKey="layerStatus.existing" />}>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
        </Tooltip>);
    } else if (item.isProblematic) {
        return (<Tooltip title={<Message key={item.name} messageKey="layerStatus.problematic" />}>
            <QuestionCircleTwoTone twoToneColor="#ffde00" />
        </Tooltip>);
    } else if (item.isUnsupported) {
        return (<Tooltip title={<Message key={item.name} messageKey="layerStatus.unsupported" />}>
            <WarningTwoTone twoToneColor="#ab0000" />
        </Tooltip>);
    }
    return null;
};
