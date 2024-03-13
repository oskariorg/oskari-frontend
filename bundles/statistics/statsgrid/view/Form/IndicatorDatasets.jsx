import React from 'react';
import { Message } from 'oskari-ui';
import { DatasetsTable } from './DatasetsTable';
import { StatisticalInfo } from './StatisticalInfo';

export const IndicatorDatasets = ({ state, controller }) => {
    if (!state.indicator.id) {
        return <Message messageKey='userIndicators.datasets.noIndicator'/>;
    }
   
    return (
        <div>
            <DatasetsTable state={state} controller={controller}/>
            <StatisticalInfo state={state} controller={controller}/>
        </div>
    );
};
