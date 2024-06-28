import React from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import { LAYER_GROUP_TOGGLE_LIMIT } from '../../../../constants';
import { LayerCountBadge } from './LayerCountBadge';
import { AllLayersSwitch } from './AllLayersSwitch';
import { InfoIcon } from 'oskari-ui/components/icons';
import { GroupToolRow } from './GroupToolRow';

/* ----- Group tools ------------- */
const StyledCollapsePanelTools = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

// Memoed based on layerCount, allLayersOnMap and group.unfilteredLayerCount
export const PanelToolContainer = React.memo(function PanelToolContainer ({ group, layerCount, allLayersOnMap, opts = {}, controller }) {
    const toggleLayersOnMap = (addLayers) => {
        if (addLayers) {
            controller.addGroupLayersToMap(group);
        } else {
            controller.removeGroupLayersFromMap(group);
        }
    };
    // the switch adds ALL the layers in the group to the map so it's misleading if we show it when some layers are not shown in the list
    // TODO: show switch for filtered layers BUT only add the layers that match the filter when toggled
    const filtered = typeof group.unfilteredLayerCount !== 'undefined' && layerCount !== group.unfilteredLayerCount;
    const toggleLimitExceeded = opts[LAYER_GROUP_TOGGLE_LIMIT] > 0 && layerCount > opts[LAYER_GROUP_TOGGLE_LIMIT];
    const showAllLayersToggle = opts[LAYER_GROUP_TOGGLE_LIMIT] !== 0 && !toggleLimitExceeded && !filtered;
    return (
        <StyledCollapsePanelTools>
            {group.description && (
                <InfoIcon
                    space={false}
                    title={group.description}
                    size={20}
                    style={{ marginRight: '5px', marginTop: '3px' }}
                />
            )}
            <LayerCountBadge
                layerCount={layerCount}
                unfilteredLayerCount={group.unfilteredLayerCount} />
            { showAllLayersToggle && <AllLayersSwitch
                checked={allLayersOnMap}
                layerCount={layerCount}
                onToggle={toggleLayersOnMap} />
            }
            <GroupToolRow group={group} />
        </StyledCollapsePanelTools>
    );
}, (prevProps, nextProps) => {
    if (prevProps.group.name !== nextProps.group.name) {
        return false;
    }
    if (prevProps.group.description !== nextProps.group.description) {
        return false;
    }
    const propsToCheck = ['allLayersOnMap', 'layerCount'];
    const changed = propsToCheck.some(prop => prevProps[prop] !== nextProps[prop]);
    if (changed) {
        return false;
    }
    const unfilteredTypeChange = typeof prevProps.group.unfilteredLayerCount !== typeof nextProps.group.unfilteredLayerCount;
    const unfilteredCountChange = prevProps.group.unfilteredLayerCount !== nextProps.group.unfilteredLayerCount;
    return !unfilteredTypeChange || !unfilteredCountChange;
});

PanelToolContainer.propTypes = {
    group: PropTypes.any,
    layerCount: PropTypes.any,
    allLayersOnMap: PropTypes.bool,
    opts: PropTypes.any,
    controller: PropTypes.object
};
/* ----- /Group tools ------------- */
