import React from 'react';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { IndicatorInfo } from './IndicatorInfo';

import { IndicatorDatasets } from './IndicatorDatasets';

export const IndicatorCollapse = ({ state, controller }) => {
    const items = [{
        key: 'info',
        label: <Message messageKey='userIndicators.panelGeneric.title' />,
        children: <IndicatorInfo state={state} controller={controller} />
    }, {
        key: 'data',
        label: <Message messageKey='userIndicators.panelData.title' />,
        children: <IndicatorDatasets state={state} controller={controller}/>
    }];
    // return <Collapse items={items} defaultActiveKey={['info', 'data']}/>
    return (
        <Collapse items={items} defaultActiveKey={['info', 'data']}>
            {items.map(({key, label, children}) => (
                <CollapsePanel key={key} header={label}>{children}</CollapsePanel>
            ))}
        </Collapse>
    );
};
