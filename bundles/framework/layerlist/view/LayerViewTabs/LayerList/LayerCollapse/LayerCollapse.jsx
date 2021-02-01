import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
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

const StyledLayerCollapsePanel = styled(LayerCollapsePanel)`
    padding-left: ${props => props.group.layers.length === 0 ? '27px' : '0px'};
`;

const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, selectedGroupIds, showWarn, controller }) => {
    if (!Array.isArray(groups) || groups.length === 0) {
        return <Alert showIcon type='info' message={<Message messageKey='errors.noResults' />} />;
    }
    return (
        <StyledCollapse bordered activeKey={openGroupTitles} onChange={keys => controller.updateOpenGroupTitles(keys)}>
            {
                groups.map(group => {
                    const layerIds = group.getLayers().map(lyr => lyr.getId());
                    // layerNames are used in key so renaming will update the UI
                    const layerNames = group.getLayers().map(lyr => lyr.getName());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    
                    let active = false;
                    // set group switch active if all layers in group are selected
                    if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
                        active = true;
                    }
                    // show the confirm dialog if group is included in showWarn
                    // also pass showWarn forward for recursive rendering of groups
                    const warnActive = showWarn.includes(group.id);
                    // Passes only ids the component is interested in.
                    // This way the content of selected layer ids remains unchanged when a layer in another group gets added on map.
                    // When the properties remain unchanged, we can benefit from memoization.
                    return (
                        <StyledLayerCollapsePanel key={group.getId() + layerNames.join()}
                            trimmed
                            selectedLayerIds={selectedLayersInGroup}
                            group={group}
                            controller={controller}
                            selectedGroupIds={selectedGroupIds}
                            active={active}
                            warnActive={warnActive}
                            showWarn={showWarn}
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
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerCollapse);
export { wrapped as LayerCollapse };
