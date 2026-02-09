import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import styled from 'styled-components';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import { ShowSelectedItemsFirst } from './ShowSelectedItemsFirst';
import { TabTitle } from './TabStatusIndicator';
import { FilterVisibleColumns } from './FilterVisibleColumns';
import { ExportButton } from './ExportData';
import { CompressedView } from './CompressedView';
import { FEATURE_EDITOR_TOOLNAME } from '../../myfeatures/constants';
import { IconButton } from 'oskari-ui/components/buttons';

export const FEATUREDATA_BUNDLE_ID = 'FeatureData';
export const FEATUREDATA_WFS_STATUS = { loading: 'loading', error: 'error' };
export const DEFAULT_PAGE_SIZE = 100;

const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());

const sorterTooltipOptions = {
    title: <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='flyout.sorterTooltip' />
};

const SelectionsContainer = styled('div')`
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
`;

const StyledTable = styled(Table)`
    .ant-table-tbody > tr.ant-table-row-selected > td {
        background-color: ${theme.getBgColor()};
        color: ${theme.getTextColor()}
    }

    .ant-table-selection-col, .ant-table-selection-column {
        display: none;
    }

    td.table-cell-compressed-view {
        white-space: nowrap;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 3em;
        max-width: 8em;
    }

    th.table-cell-compressed-view {
        white-space: nowrap;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 3em;
        max-width: 8em;

        span.ant-table-column-title {
            max-width: 75%;
            white-space: nowrap;
            word-break: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        span.ant-table-column-sorter {
            max-width: 25%;
        }
    }

    overflow-y: auto;
    flex: 1 1 auto;
`;

const FeatureDataTable = styled('div')`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 75vh;
`;

const SelectionRow = styled('div')`
    display: flex;
    flex-direction: row;
    margin: auto 0;
    padding-bottom: 1em;
`;

const SelectionRowGroup = styled('div')`
    display: flex;
    flex-direction: row;
    margin: auto 0;
`;

const createFeaturedataGrid = (features, selectedFeatureIds, showSelectedFirst, showCompressed, sorting, visibleColumnsSettings, showExportButton, layer, controller) => {
    if (!features || !features.length) {
        return <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'layer.outOfContentArea'}/>;
    };
    const columnSettings = createColumnSettings(selectedFeatureIds, showSelectedFirst, showCompressed, sorting, visibleColumnsSettings, layer);
    const dataSource = createDatasourceFromFeatures(features);
    const featureTable = <FeatureDataTable>
        <SelectionsContainer>
            { showExportButton && <>
                <SelectionRow>
                    <ExportButton onClick={() => { controller.openExportDataPopup(); }}/>
                    <FilterVisibleColumns {...visibleColumnsSettings} updateVisibleColumns={controller.updateVisibleColumns}/>
                </SelectionRow>
                <SelectionRow>
                    <ShowSelectedItemsFirst showSelectedFirst={showSelectedFirst} toggleShowSelectedFirst={controller.toggleShowSelectedFirst}/>
                    <CompressedView showCompressed={showCompressed} toggleShowCompressed={controller.toggleShowCompressed}/>
                </SelectionRow>
            </>}

            { !showExportButton && <>
                <SelectionRow>
                    <SelectionRowGroup>
                        <ShowSelectedItemsFirst showSelectedFirst={showSelectedFirst} toggleShowSelectedFirst={controller.toggleShowSelectedFirst}/>
                        <CompressedView showCompressed={showCompressed} toggleShowCompressed={controller.toggleShowCompressed}/>
                    </SelectionRowGroup>
                    <FilterVisibleColumns {...visibleColumnsSettings} updateVisibleColumns={controller.updateVisibleColumns}/>
                </SelectionRow>
                <SelectionRow>
                </SelectionRow>
            </>}
        </SelectionsContainer>
        <StyledTable
            columns={ columnSettings }
            size={ 'small'}
            dataSource={ dataSource }
            pagination={{ defaultPageSize: DEFAULT_PAGE_SIZE, hideOnSinglePage: true, simple: true }}
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
    </FeatureDataTable>;
    return featureTable;
};

const createFeatureToolsColumn = (layer) => {

    const featureTools = layer?.getFeatureTools() || null;
    if (!featureTools) {
        return;
    };

    return {
        align: 'left',
        title: <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='table.featureTools.title' />,
        render: (item) => {
            return <>
                { featureTools.map((tool) => {
                    if (tool.getIconComponent()) {
                        return <IconButton
                            key={item.key + tool.getTitle()}
                            title={tool.getTitle()}
                            icon={tool.getIconComponent()}
                            onClick={() => tool.getCallback()(layer.getId(), item.key)}
                        />;
                    }

                    return <span
                        key={item.key + tool.getTitle()}
                        onClick={() => {tool.getCallback()(layer.getId(), item.key)}}>
                        {tool.getTitle()}
                    </span>;
                })}
            </>;
        }
    };
};

const createColumnSettings = (selectedFeatureIds, showSelectedFirst, showCompressed, sorting, visibleColumnsSettings, layer) => {
    const { allColumns, visibleColumns, activeLayerPropertyLabels } = visibleColumnsSettings;
    const retVal = allColumns
        .filter(key => visibleColumns.includes(key))
        .map(key => {
            return {
                align: 'left',
                className: showCompressed ? 'table-cell-compressed-view' : '',
                title: activeLayerPropertyLabels && activeLayerPropertyLabels[key] ? activeLayerPropertyLabels[key] : key,
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
                },
                ellipsis: true
            };
        });

    if (layer?.getFeatureTools()?.length) {
        retVal.push(createFeatureToolsColumn(layer));
    }

    return retVal;

};

const createDatasourceFromFeatures = (features) => {
    return features.map(feature => {
        return {
            key: feature.id,
            ...feature.properties
        };
    });
};

const createLayerTabs = (layerId, layers, features, selectedFeatureIds, showSelectedFirst, showCompressed, sorting, loadingStatus, visibleColumnsSettings, controller) => {
    const tabs = layers?.map(layer => {
        const status = loadingStatus[layer.getId()];
        const showExportButton = layer.hasPermission('download');
        return {
            key: layer.getId(),
            label: <TabTitle
                status={status} title={layer.getName()}
                active={layer.getId() === layerId && features?.length > 0}
                openSelectByPropertiesPopup={controller.openSelectByPropertiesPopup}
            />,
            children: layer.getId() === layerId
                ? createFeaturedataGrid(features, selectedFeatureIds, showSelectedFirst, showCompressed, sorting, visibleColumnsSettings, showExportButton, layer, controller)
                : null
        };
    }) || [];
    return tabs;
};

const ContainerDiv = styled('div')`
    margin: 1em;
    min-width: 20vw;
    max-width: ${props => props.isMobile ? '100' : 75}vw;
    .ant-table-selection-col, .ant-table-selection-column {
        display: none;
    }
`;
export const FeatureDataContainer = ({ state, controller }) => {
    const { layers,
        activeLayerId,
        activeLayerFeatures,
        selectedFeatureIds,
        showSelectedFirst,
        showCompressed,
        loadingStatus,
        visibleColumnsSettings,
        sorting } = state;
    const tabs = createLayerTabs(
        activeLayerId,
        layers,
        activeLayerFeatures,
        selectedFeatureIds,
        showSelectedFirst,
        showCompressed,
        sorting,
        loadingStatus,
        visibleColumnsSettings,
        controller);

    return (
        <ContainerDiv isMobile={Oskari.util.isMobile()}>
            <Tabs
                activeKey = { activeLayerId }
                items={ tabs }
                onChange={(key) => controller.setActiveTab(key) }
            />
        </ContainerDiv>
    );
};

FeatureDataContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
