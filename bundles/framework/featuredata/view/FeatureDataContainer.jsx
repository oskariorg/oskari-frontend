import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import { ShowSelectedItemsFirst } from './ShowSelectedItemsFirst';
import { FEATUREDATA_DEFAULT_HIDDEN_FIELDS } from '../plugin/FeatureDataPluginHandler';

export const FEATUREDATA_BUNDLE_ID = 'FeatureData';

const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());

const sorterTooltipOptions = {
    title: <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='flyout.sorterTooltip' />
};

const StyledTable = styled(Table)`
    .ant-table-tbody > tr.ant-table-row-selected > td {
        background-color: ${theme.getBgColor()};
        color: ${theme.getTextColor()}
    }

    .ant-table-selection-col, .ant-table-selection-column {
        display: none;
    }
`;

const createFeaturedataGrid = (features, selectedFeatureIds, showSelectedFirst, sorting, controller) => {
    if (!features || !features.length) {
        return <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'layer.outOfContentArea'}/>;
    };
    const columnSettings = createColumnSettingsFromFeatures(features, selectedFeatureIds, showSelectedFirst, sorting);
    const dataSource = createDatasourceFromFeatures(features);
    const featureTable = <>
        <ShowSelectedItemsFirst showSelectedFirst={showSelectedFirst} toggleShowSelectedFirst={controller.toggleShowSelectedFirst}/>
        <StyledTable
            columns={ columnSettings }
            size={ 'large '}
            dataSource={ dataSource }
            pagination={{ position: ['none', 'none'] }}
            onChange={(pagination, filters, sorter, extra) => {
                controller.updateSorting(sorter);
            }}
            rowSelection={{ selectedRowKeys: selectedFeatureIds }}
            onRow={(record) => {
                return {
                    onClick: () => {
                        controller.toggleFeature(record.key);
                    }
                };
            }}
        />;
    </>;
    return featureTable;
};

const createColumnSettingsFromFeatures = (features, selectedFeatureIds, showSelectedFirst, sorting) => {
    return Object.keys(features[0].properties)
        .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key))
        .map(key => {
            return {
                align: 'left',
                title: key,
                key,
                dataIndex: key,
                showSorterTooltip: sorterTooltipOptions,
                sortDirections: ['ascend', 'descend', 'ascend'],
                sortOrder: sorting?.columnKey && key === sorting.columnKey ? sorting.order : null,
                sorter: {
                    compare: (a, b, sortOrder) => {
                        const keepSelectedOnTopWhenDescending = sortOrder === 'ascend' ? 1 : -1;
                        if (showSelectedFirst && selectedFeatureIds?.length) {
                            if (selectedFeatureIds.includes(a.__fid) && !selectedFeatureIds.includes(b.__fid)) {
                                return -1 * keepSelectedOnTopWhenDescending;
                            } else if (!selectedFeatureIds.includes(a.__fid) && selectedFeatureIds.includes(b.__fid)) {
                                return 1 * keepSelectedOnTopWhenDescending;
                            }
                        }
                        return Oskari.util.naturalSort(a[key], b[key]);
                    }
                }
            };
        });
};

const createDatasourceFromFeatures = (features) => {
    return features.map(feature => {
        return {
            key: feature.id,
            ...feature.properties
        };
    });
};

const createLayerTabs = (layerId, layers, features, selectedFeatureIds, showSelectedFirst, sorting, controller) => {
    const tabs = layers?.map(layer => {
        return {
            key: layer.getId(),
            label: layer.getName(),
            children: layer.getId() === layerId
                ? createFeaturedataGrid(features, selectedFeatureIds, showSelectedFirst, sorting, controller)
                : null
        };
    }) || [];
    return tabs;
};

const ContainerDiv = styled('div')`
    padding: 1em;
    min-width: 35em; //prevents ant-tabs from entering flickering mode
    .ant-table-selection-col, .ant-table-selection-column {
        display: none;
    }
`;
export const FeatureDataContainer = ({ state, controller }) => {
    const { layers, activeLayerId, activeLayerFeatures, selectedFeatureIds, showSelectedFirst, sorting } = state;
    const tabs = createLayerTabs(activeLayerId, layers, activeLayerFeatures, selectedFeatureIds, showSelectedFirst, sorting, controller);
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
