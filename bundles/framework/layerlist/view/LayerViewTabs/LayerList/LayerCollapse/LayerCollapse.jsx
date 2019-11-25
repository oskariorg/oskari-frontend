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

export const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, mutator, locale }) => {
    if (!Array.isArray(groups) || groups.length === 0) {
        return <Alert showIcon type="info" description={locale.errors.noResults}/>;
    }
    return (
        <StyledCollapse bordered activeKey={openGroupTitles} onChange={keys => mutator.updateOpenGroupTitles(keys)}>
            {
                groups.map(group => {
                    const layerIds = group.getLayers().map(lyr => lyr.getId());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    // Passes only ids the component is interested in.
                    // This way the content of selected layer ids remains unchanged when a layer in another group gets added on map.
                    // When the properties remain unchanged, we can benefit from memoization.
                    return (
                        <LayerCollapsePanel key={group.getTitle()}
                            trimmed
                            selectedLayerIds={selectedLayersInGroup}
                            group={group}
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
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};
