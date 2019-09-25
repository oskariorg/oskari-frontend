
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, CollapsePanel, List, ListItem } from 'oskari-ui';
import { Layer } from './Layer';
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

const renderLayer = ({ model, even, selected, mapSrs, mutator, locale }) => {
    const itemProps = { model, even, selected, mapSrs, mutator, locale };
    return (
        <StyledListItem>
            <Layer key={model.getId()} {...itemProps} />
        </StyledListItem>
    );
};
renderLayer.propTypes = {
    model: PropTypes.any,
    even: PropTypes.any,
    selected: PropTypes.any,
    mapSrs: PropTypes.any,
    mutator: PropTypes.any,
    locale: PropTypes.any
};

const LayerCollapsePanel = (props) => {
    const { group, showLayers, selectedLayerIds, mapSrs, mutator, locale, ...propsNeededForPanel } = props;
    const layerRows = showLayers.map((layer, index) => {
        const layerProps = {
            model: layer,
            even: index % 2 === 0,
            selected: Array.isArray(selectedLayerIds) && selectedLayerIds.includes(layer.getId()),
            mapSrs,
            mutator,
            locale
        };
        return layerProps;
    });
    const visibleLayerCount = showLayers ? showLayers.length : 0;
    if (group.getTitle() === 'Geologia') {
        console.log('rendering Geologia CollapsePanel');
    }
    return (
        <CollapsePanel {...propsNeededForPanel}
            header={group.getTitle()}
            extra={
                <Badge inversed={true} count={getBadgeText(group, visibleLayerCount)}/>
            }>
            <List bordered={false} dataSource={layerRows} renderItem={renderLayer}/>
        </CollapsePanel>
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

const comparisonFn = (prevProps, nextProps) => {
    // expandIcon is something the parent component adds as a context
    const ignored = ['expandIcon'];
    let useMemoized = true;
    Object.getOwnPropertyNames(nextProps).forEach(name => {
        if (ignored.includes(name)) {
            return;
        }
        if (nextProps[name] !== prevProps[name]) {
            console.log(name + ' does not equal ');
            useMemoized = false;
        }
    });
    return useMemoized;
};
const memoized = React.memo(LayerCollapsePanel, comparisonFn);
export { memoized as LayerCollapsePanel };
