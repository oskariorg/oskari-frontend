import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';
import styled from 'styled-components';

const Col = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const ToolbarToolComponent = ({ state, controller }) => {
    // eslint-disable-next-line camelcase
    const { history_forward, history_back, measureline, measurearea } = state;
    // eslint-disable-next-line camelcase
    const history = (history_back || history_forward);
    return <Col>
        <Checkbox checked={history} onChange={evt => controller.historySelectionChanged(evt.target.checked)}>
            <Message bundleKey={'MapModule'} messageKey={'publisherTools.PublisherToolbarPlugin.history'}/>
        </Checkbox>
        <Checkbox checked={measureline} onChange={evt => controller.selectionChanged('measureline', evt.target.checked)}>
            <Message bundleKey={'MapModule'} messageKey={'publisherTools.PublisherToolbarPlugin.measureline'}/>
        </Checkbox>
        <Checkbox checked={measurearea} onChange={evt => controller.selectionChanged('measurearea', evt.target.checked)}>
            <Message bundleKey={'MapModule'} messageKey={'publisherTools.PublisherToolbarPlugin.measurearea'}/>
        </Checkbox>
    </Col>;
};

ToolbarToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
