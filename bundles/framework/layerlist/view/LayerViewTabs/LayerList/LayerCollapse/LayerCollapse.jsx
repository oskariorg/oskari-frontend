import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { LayerCollapsePanel } from './LayerCollapsePanel';
import { Alert } from '../Alert';
import styled from 'styled-components';
import { PanelToolContainer } from './PanelToolContainer';
const StyledCollapse = styled(Collapse)`
    border-radius: 0 !important;
    & > div {
        border-radius: 0 !important;
        &:last-child {
            padding-bottom: 2px;
        }
    }

    .ant-collapse-content > .ant-collapse-content-box {
        padding: 0px;
        & > .ant-list {
            width: 100%;
        }
    }

    .ant-collapse-header {
        flex-direction: row;
        flex-wrap: wrap !important;
    }
`;

export const getLayerRowModels = (layers = [], selectedLayerIds = [], controller, opts) => {
    return layers.map(oskariLayer => {
        return {
            id: oskariLayer.getId(),
            model: oskariLayer,
            selected: selectedLayerIds.includes(oskariLayer.getId()),
            controller,
            opts
        };
    });
};

const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, opts, controller }) => {
    if (!Array.isArray(groups) || groups.length === 0) {
        return <Alert showIcon type='info' message={<Message messageKey='errors.noResults' />} />;
    }

    // TODO: openGroupTitles we should probably check and do something with the info

    const groupItems = groups.map(group => {
        const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller, opts);
        // set group switch active if all layers in group are selected
        const allLayersOnMap = layerRows.length > 0 && layerRows.every(layer => selectedLayerIds.includes(layer.id));
        return {
            key: group.getId(),
            label: group.getTitle(),
            className: `t_group gid_${group.getId()}`,
            extra: <PanelToolContainer
                group={group}
                opts={opts}
                layerCount={group.getLayerCount()}
                controller={controller}
                allLayersOnMap={allLayersOnMap} />,
            children: <LayerCollapsePanel key={group.getId()}
                trimmed
                selectedLayerIds={selectedLayerIds}
                group={group}
                openGroupTitles={openGroupTitles}
                layerRows={layerRows}
                opts={opts}
                controller={controller}
            />
        };
    });

    return (
        <StyledCollapse
            bordered activeKey={openGroupTitles}
            onChange={keys => controller.updateOpenGroupTitles(keys)}
            items={groupItems}
        />
    );
};

LayerCollapse.propTypes = {
    groups: PropTypes.array.isRequired,
    openGroupTitles: PropTypes.array.isRequired,
    filtered: PropTypes.array,
    selectedLayerIds: PropTypes.array.isRequired,
    opts: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerCollapse);
export { wrapped as LayerCollapse };
