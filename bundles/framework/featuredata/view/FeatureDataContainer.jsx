import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Message } from 'oskari-ui';
import { getSorterFor, Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';

const FEATUREDATA_DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];
const BUNDLE_ID = 'FeatureData';

const createFeaturedataGrid = (features) => {
    if (!features || !features.length) {
        return <Message bundleKey={BUNDLE_ID} messageKey={'layer.out-of-content-area'}/>;
    };
    const columnSettings = createColumnSettingsFromFeatures(features);
    const dataSource = createDatasourceFromFeatures(features);
    const featureTable = <Table
        columns={ columnSettings }
        size={ 'large '}
        dataSource={ dataSource }
        pagination={{ position: ['none', 'none'] }}
    />;

    return featureTable;
};

const createColumnSettingsFromFeatures = (features) => {
    return Object.keys(features[0].properties)
        .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key))
        .map(key => {
            return {
                align: 'left',
                title: key,
                dataIndex: key,
                sorter: getSorterFor(key)
            };
        });
};

const createDatasourceFromFeatures = (features) => {
    return features.map(feature => {
        return {
            key: feature.properties.__fid,
            ...feature.properties
        };
    });
};

const createLayerTabs = (layerId, layers, features) => {
    const tabs = layers?.map(layer => {
        return {
            key: layer.getId(),
            label: layer.getName(),
            children: layer.getId() === layerId
                ? createFeaturedataGrid(features)
                : null
        };
    }) || [];
    return tabs;
};

const ContainerDiv = styled('div')`
    padding: 1em;
`;
export const FeatureDataContainer = ({ state, controller }) => {
    const { layers, activeLayerId, activeLayerFeatures } = state;
    const tabs = createLayerTabs(activeLayerId, layers, activeLayerFeatures);
    return (
        <ContainerDiv>
            <Tabs
                activeKey = { activeLayerId }
                items={ tabs }
                onChange={(key) => controller.setActiveTab(key)}/>
        </ContainerDiv>
    );
};

FeatureDataContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
