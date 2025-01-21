import React from 'react';
import { PanelToolContainer } from './PanelToolContainer';
import { LayerCollapsePanel } from './LayerCollapsePanel';

const getLayerRowModels = (layers = [], selectedLayerIds = [], controller, opts) => {
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

export const getCollapseItems = (groups, openGroupTitles, selectedLayerIds, opts, controller, panelProps) => {
    return groups.map(group => {
        const key = group.getId();
        const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller, opts);
        // set group switch active if all layers in group are selected
        const allLayersOnMap = layerRows.length > 0 && layerRows.every(layer => selectedLayerIds.includes(layer.id));
        const hasChildren = layerRows.length > 0 || group.getGroups().length > 0;
        const propsNeededForPanel = panelProps || {};

        return {
            key,
            label: group.getTitle(),
            className: `t_group gid_${key}`,
            collapsible: hasChildren ? 'header' : 'disabled',
            extra: <PanelToolContainer
                group={group}
                opts={opts}
                layerCount={group.getLayerCount()}
                controller={controller}
                allLayersOnMap={allLayersOnMap} />,
            children: <LayerCollapsePanel
                key={key}
                trimmed
                selectedLayerIds={selectedLayerIds}
                group={group}
                openGroupTitles={openGroupTitles}
                layerRows={layerRows}
                opts={opts}
                controller={controller}
                {... propsNeededForPanel}
            />
        };
    });
};
