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

    > .ant-collapse-content > .ant-collapse-content-box {
        padding: 0px;
        & > .ant-list {
            width: 100%;
        }
    }
    & > div:first-child {
        min-height: 22px;
    }
    & > .ant-collapse-header {
        flex-direction: row;
        flex-wrap: wrap !important;
    }
`;

const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, opts, controller }) => {
    if (!Array.isArray(groups) || groups.length === 0) {
        return <Alert showIcon type='info' message={<Message messageKey='errors.noResults' />} />;
    }

    const groupItems = groups.map(group => {
        const allLayersOnMap = true;
        return {
            key: group.getId(),
            label: group.getTitle(),
            className: `t_group gid_${group.getId()}`,
            // data-attr doesn't seem to work for the panel in AntD-version 4.8.5
//            data-gid={group.getId()}
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
