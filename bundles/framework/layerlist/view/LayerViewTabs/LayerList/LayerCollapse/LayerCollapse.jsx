import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Alert } from '../Alert';
import styled from 'styled-components';
import { getCollapseItems } from './LayerCollapseHelper';

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

const LayerCollapse = ({ groups, openGroupTitles, selectedLayerIds, opts, controller }) => {
    const items = getCollapseItems(groups, openGroupTitles, selectedLayerIds, opts, controller);
    if (!items.length) {
        return <Alert showIcon type='info' message={<Message messageKey='errors.noResults' />} />;
    }
    return (
        <StyledCollapse
            bordered
            activeKey={openGroupTitles}
            onChange={keys => controller.updateOpenGroupTitles(keys)}
            items={items}
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
