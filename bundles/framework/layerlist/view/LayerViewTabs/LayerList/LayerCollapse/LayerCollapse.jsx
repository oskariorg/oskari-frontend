import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { LayerCollapsePanel } from './LayerCollapsePanel';
import { Alert } from '../Alert';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    border-radius: 0 !important;
    & > div {
        border-radius: 0 !important;
        &:last-child {
            padding-bottom: 2px;
        }
    }
`;

const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, opts, controller }) => {

    if (!Array.isArray(groups) || groups.length === 0) {
        return <Alert showIcon type='info' message={<Message messageKey='errors.noResults' />} />;
    }
    return (
        <StyledCollapse
            bordered activeKey={openGroupTitles}
            onChange={keys => controller.updateOpenGroupTitles(keys)}
        >
            {
                groups.map(group => {
                    return (
                        <LayerCollapsePanel key={group.getId()}
                            trimmed
                            selectedLayerIds={selectedLayerIds}
                            group={group}
                            opts={opts}
                            controller={controller}
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
    opts: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerCollapse);
export { wrapped as LayerCollapse };
