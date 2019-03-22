
import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from '../../../../admin/admin-layereditor/components/List';
import { Layer } from './Layer';
import { Panel } from '../../../../admin/admin-layereditor/components/Collapse';
import { Badge } from '../../../../admin/admin-layereditor/components/Badge';
import styled from 'styled-components';

const StyledListItem = styled(ListItem)`
    padding: 0 !important;
    display: block !important;
`;
const getBadgeText = (group, visibleLayerCount) => {
    let badgeText = group.getLayers().length;
    if (visibleLayerCount !== group.getLayers().length) {
        badgeText = visibleLayerCount + ' / ' + badgeText;
    }
    return badgeText;
};

const renderItem = ({model, even, selected, mapSrs, mutator, locale}) => {
    const itemProps = {model, even, selected, mapSrs, mutator, locale};
    return (
        <StyledListItem>
            <Layer key={model.getId()} {...itemProps} />
        </StyledListItem>
    );
};
renderItem.propTypes = {
    model: PropTypes.any,
    even: PropTypes.bool,
    selected: PropTypes.bool,
    mapSrs: PropTypes.string,
    mutator: PropTypes.any,
    locale: PropTypes.any
};

export const LayerCollapsePanel = ({group, showLayers, selectedLayerIds, mapSrs, mutator, locale, ...propsNeededForPanel}) => {
    const items = showLayers.map((layer, index) => {
        const itemProps = {
            model: layer,
            even: index % 2 === 0,
            selected: Array.isArray(selectedLayerIds) && selectedLayerIds.includes(layer.getId()),
            mapSrs,
            mutator,
            locale
        };
        return itemProps;
    });
    const visibleLayerCount = showLayers ? showLayers.length : 0;
    return (
        <Panel {...propsNeededForPanel}
            header={group.getTitle()}
            extra={
                <Badge inversed={true} count={getBadgeText(group, visibleLayerCount)}/>
            }>
            <List bordered={false} dataSource={items} renderItem={renderItem}/>
        </Panel>
    );
};

LayerCollapsePanel.propTypes = {
    group: PropTypes.any.isRequired,
    showLayers: PropTypes.array.isRequired,
    selectedLayerIds: PropTypes.array.isRequired,
    mapSrs: PropTypes.string.isRequired,
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};
