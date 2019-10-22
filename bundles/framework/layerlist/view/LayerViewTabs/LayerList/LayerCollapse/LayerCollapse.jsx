import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'oskari-ui';
import { LayerCollapsePanel } from './LayerCollapsePanel';
import { Alert } from '../Alert';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    border-radius: 0 !important;
    &>div {
        border-radius: 0 !important;
        &:last-child {
            padding-bottom: 2px;
        }
    }
`;

export const LayerCollapse = ({ groups, openGroupTitles, filtered, selectedLayerIds, mapSrs, mutator, locale }) => {
    if (!Array.isArray(groups) || groups.length === 0 || (filtered && filtered.length === 0)) {
        return <Alert showIcon type="info" description={locale.errors.noResults}/>;
    }
    const panels = (filtered || groups).map(cur => ({
        group: cur.group || cur,
        showLayers: cur.layers
    }));
    return (
        <StyledCollapse bordered activeKey={openGroupTitles} onChange={keys => mutator.updateOpenGroupTitles(keys)}>
            {
                panels.map(({ group, showLayers }) => {
                    const selectedLayersInGroup = selectedLayerIds.filter(cur => showLayers.map(lyr => lyr.getId()).includes(cur));
                    // Passes only ids the component is interested in.
                    // This way the content of selected layer ids remains unchanged when a layer in another group gets added on map.
                    // When the properties remain unchanged, we can benefit from memoization.
                    return (
                        <LayerCollapsePanel key={group.getTitle()}
                            trimmed
                            selectedLayerIds={selectedLayersInGroup}
                            group={group}
                            showLayers={showLayers}
                            mapSrs={mapSrs}
                            mutator={mutator}
                            locale={locale}
                        />
                    );
                })
            }
        </StyledCollapse>
    );
};

LayerCollapse.propTypes = {
    groups: PropTypes.array.isRequired,
    openGroupTitles: PropTypes.array.isRequired,
    filtered: PropTypes.array,
    selectedLayerIds: PropTypes.array.isRequired,
    mapSrs: PropTypes.string.isRequired,
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};
