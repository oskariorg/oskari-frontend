
import React from 'react';
import PropTypes from 'prop-types';
import { List } from '../../../../admin/admin-layereditor/components/List';
import { Layer } from './Layer';
import { Panel } from '../../../../admin/admin-layereditor/components/Collapse';
import { Badge } from '../../../../admin/admin-layereditor/components/Badge';

const getBadgeText = (group, visibleLayerCount) => {
    let badgeText = group.getLayers().length;
    if (visibleLayerCount !== group.getLayers().length) {
        badgeText = visibleLayerCount + ' / ' + badgeText;
    }
    return badgeText;
};

export const LayerCollapsePanel = ({group, showLayers, selectedLayerIds, ...rest}) => {
    const layers = showLayers.map((lyr, index) => {
        const selected = Array.isArray(selectedLayerIds) && selectedLayerIds.includes(lyr.getId());
        const layerProps = {
            model: lyr,
            even: index % 2 === 0,
            selected,
            ...rest
        };
        return <Layer key={lyr.getId()} {...layerProps} />;
    });
    const visibleLayerCount = showLayers ? showLayers.length : 0;
    return (
        <Panel {...rest}
            header={group.getTitle()}
            extra={
                <Badge inversed={true} count={getBadgeText(group, visibleLayerCount)}/>
            }>
            <List bordered={false} dataSource={layers}/>
        </Panel>
    );
};

LayerCollapsePanel.propTypes = {
    group: PropTypes.any.isRequired,
    showLayers: PropTypes.array.isRequired,
    selectedLayerIds: PropTypes.arrayOf(PropTypes.number),
    mutator: PropTypes.any.isRequired
};
