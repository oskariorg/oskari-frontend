import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'oskari-ui';
import { LayerCollapsePanel } from './LayerCollapsePanel';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { getLayerRowModels } from './LayerCollapse';

const StyledSubCollapse = styled(Collapse)`
    border: none;
    border-top: 1px solid #d9d9d9;
    padding-left: 15px !important;
`;
export const SubGroupCollapse = ({ subgroups = [], selectedLayerIds, openGroupTitles, opts, controller, propsNeededForPanel }) => {
    if (!subgroups?.length) {
        // no subgroups
        return null;
    }
    const items = subgroups.map(group => {
        return {
            key: group.getId(),
            label: group.getTitle(),
            children: <LayerCollapsePanel
                key={group.getId()}
                group={group}
                selectedLayerIds={selectedLayerIds}
                openGroupTitles={openGroupTitles}
                controller={controller}
                opts={opts}
                {... propsNeededForPanel}
                layerRows={getLayerRowModels(group.getLayers(), selectedLayerIds, controller, opts)}
            />
        };
    });
    return <StyledSubCollapse
        activeKey={openGroupTitles}
        onChange={keys => controller.updateOpenGroupTitles(keys)}
        items={items}
    />;
};

SubGroupCollapse.propTypes = {
    subgroups: PropTypes.any.isRequired,
    selectedLayerIds: PropTypes.array.isRequired,
    openGroupTitles: PropTypes.array.isRequired,
    opts: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layerRows: PropTypes.array,
    propsNeededForPanel: PropTypes.any
};
