import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse } from 'oskari-ui';
import { IndicatorInfo } from './IndicatorInfo';
import { IndicatorDatasets } from './IndicatorDatasets';

export const IndicatorCollapse = ({ state, controller }) => {
    const defaultActiveKey = state.indicator.id ? ['data'] : ['info'];
    const items = [{
        key: 'info',
        label: <Message messageKey='userIndicators.info.title' />,
        children: <IndicatorInfo state={state} controller={controller} />
    }, {
        key: 'data',
        label: <Message messageKey='userIndicators.datasets.title' />,
        children: <IndicatorDatasets state={state} controller={controller}/>
    }];
    return <Collapse items={items} defaultActiveKey={defaultActiveKey}/>;
};
IndicatorCollapse.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
