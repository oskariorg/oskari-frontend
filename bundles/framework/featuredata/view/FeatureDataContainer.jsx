import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import { ShowSelectedItemsFirst } from './ShowSelectedItemsFirst';
import { FEATUREDATA_DEFAULT_HIDDEN_FIELDS } from '../plugin/FeatureDataPluginHandler';
import { TabTitle } from './TabStatusIndicator';
import { FilterVisibleColumns } from './FilterVisibleColumns';

export const FEATUREDATA_BUNDLE_ID = 'FeatureData';
export const FEATUREDATA_WFS_STATUS = { loading: 'loading', error: 'error' };

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

const SelectionsContainer = styled('div')`
    display: flex;
    padding-bottom: 1em;
`;

const createFeaturedataGrid = (features, selectedFeatureIds, showSelectedFirst, sorting, visibleColumnsSettings, controller) => {
    if (!features || !features.length) {
        return <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'layer.outOfContentArea'}/>;
    };
    const columnSettings = createColumnSettingsFromFeatures(features, selectedFeatureIds, showSelectedFirst, sorting, visibleColumnsSettings);
    const dataSource = createDatasourceFromFeatures(features);
    const featureTable = <>
        <SelectionsContainer>
            <ShowSelectedItemsFirst showSelectedFirst={showSelectedFirst} toggleShowSelectedFirst={controller.toggleShowSelectedFirst}/>
            <FilterVisibleColumns {...visibleColumnsSettings} updateVisibleColumns={controller.updateVisibleColumns}/>
        </SelectionsContainer>
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
        />
    </>;
    return featureTable;
};

const createColumnSettingsFromFeatures = (features, selectedFeatureIds, showSelectedFirst, sorting, visibleColumnsSettings) => {
    const { visibleColumns } = visibleColumnsSettings;
    return Object.keys(features[0].properties)
        .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key) && visibleColumns.includes(key))
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

const createLayerTabs = (layerId, layers, features, selectedFeatureIds, showSelectedFirst, sorting, loadingStatus, visibleColumnsSettings, controller) => {
    const tabs = layers?.map(layer => {
        const status = loadingStatus[layer.getId()];
        return {
            key: layer.getId(),
            label: <TabTitle status={status} title={layer.getName()} active={layer.getId() === layerId} openSelectByPropertiesPopup={controller.openSelectByPropertiesPopup}/>,
            children: layer.getId() === layerId
                ? createFeaturedataGrid(features, selectedFeatureIds, showSelectedFirst, sorting, visibleColumnsSettings, controller)
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
    const { layers, activeLayerId, activeLayerFeatures, selectedFeatureIds, showSelectedFirst, loadingStatus, visibleColumnsSettings, sorting } = state;
    const tabs = createLayerTabs(activeLayerId, layers, activeLayerFeatures, selectedFeatureIds, showSelectedFirst, sorting, loadingStatus, visibleColumnsSettings, controller);
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
