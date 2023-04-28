import React from 'react';
import { Table } from '../../../../src/react/components/Table';
import { FeatureDataContainer } from '../view/FeatureDataContainer';
import { showFlyout } from '../../../../src/react/components/window';

export const createFeaturedataGrid = (columnSettings, dataSource) => {
    const featureTable = <Table
        columns={ columnSettings }
        size={ 'large '}
        dataSource={ dataSource }
        pagination={{ position: ['none', 'none'] }}
    />;

    return featureTable;
};

export const showFeatureDataFlyout = (state) => {
    const content = <FeatureDataContainer state = { state }/>;
    const controls = showFlyout('Feature data flyout', content, () => { state.onClose(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update('Feature data flyout', <FeatureDataContainer state = { state }/>);
        }
    };
};
