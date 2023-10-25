import React, { useState } from 'react';
import { Select, Message, Spin } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { LocaleProvider } from 'oskari-ui/util';
import { Sorter } from './Sorter';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    max-height: 850px;
    overflow-y: scroll;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;
const StyledTable = styled(Table)`
    .ant-table-column-sorter {
        display: none;
    }
    .ant-table table {
        height: 100%;
    }
    .ant-table-column-sorters {
        height: 100%;
    }
    .ant-table-column-title {
        height: 100%;
    }
`;
const RegionHeader = styled('div')`
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    word-break: break-word;
`;
const IndicatorHeader = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 5px;
    word-wrap: break-word;
    word-break: break-word;
    text-align: left;
`;
const StyledRemoveButton = styled(IconButton)`
    margin-left: 10px;
`;
const HeaderCell = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`;

const TableFlyout = ({ state, controller }) => {
    let initialSort = {
        regionName: null
    };
    state.indicators?.forEach(indicator => {
        initialSort[indicator.hash] = null;
    });
    const [sortOrder, setSortOrder] = useState(initialSort);

    const changeSortOrder = (col) => {
        let newOrder = { ...sortOrder };
        if (newOrder[col] === 'descend' || newOrder[col] === null) {
            newOrder[col] = 'ascend';
        } else {
            newOrder[col] = 'descend';
        }
        for (const key of Object.keys(newOrder)) {
            if (key !== col) {
                newOrder[key] = null;
            }
        }
        setSortOrder(newOrder);
    };

    const columnSettings = [];

    columnSettings.push({
        dataIndex: 'regionName',
        align: 'left',
        width: 125,
        sorter: getSorterFor('regionName'),
        sortOrder: sortOrder['regionName'],
        showSorterTooltip: false,
        onCell: (record, rowIndex) => ({
            style: { background: '#ffffff' }
        }),
        onHeaderCell: (record, rowIndex) => ({
            style: { background: '#fafafa' }
        }),
        title: () => {
            return (
                <HeaderCell>
                    <RegionHeader>
                        <Message messageKey='statsgrid.areaSelection.title' />
                        {Oskari.util.isEmbedded ? (
                            state.selectedRegionset?.name
                        ) : (
                            <Select
                                filterOption={false}
                                options={state.regionsetOptions?.map(rs => ({ value: rs.id, label: rs.name }))}
                                value={state.selectedRegionset?.id}
                                onChange={(value) => controller.setSelectedRegionset(value)}
                            />
                        )}
                    </RegionHeader>
                    <Sorter
                        sortOrder={sortOrder['regionName']}
                        changeSortOrder={() => changeSortOrder('regionName')}
                    />
                </HeaderCell>
            );
        }
    });
    state.indicators?.forEach(indicator => {
        columnSettings.push({
            dataIndex: 'data',
            align: 'right',
            width: 125,
            sorter: (a, b) => a.data[indicator.hash] - b.data[indicator.hash],
            sortOrder: sortOrder[indicator.hash],
            showSorterTooltip: false,
            onCell: (record, rowIndex) => ({
                style: { background: state.activeIndicator === indicator.hash ? '#fafafa' : '#ffffff' }
            }),
            onHeaderCell: (record, rowIndex) => ({
                style: { background: state.activeIndicator === indicator.hash ? '#f0f0f0' : '#fafafa' }
            }),
            title: () => {
                return (
                    <HeaderCell>
                        <IndicatorHeader
                            onClick={(e) => {
                                controller.setActiveIndicator(indicator.hash);
                            }}
                        >
                            {indicator.labels?.full}
                            <StyledRemoveButton
                                type='delete'
                                onClick={() => controller.removeIndicator(indicator)}
                            />
                        </IndicatorHeader>
                        <Sorter
                            sortOrder={sortOrder[indicator.hash]}
                            changeSortOrder={() => changeSortOrder(indicator.hash)}
                        />
                    </HeaderCell>
                );
            },
            render: (title, item) => {
                const formatter = Oskari.getNumberFormatter(indicator?.classification?.fractionDigits);
                let data = item.data ? item.data[indicator.hash] : '';
                if (typeof data === 'number') {
                    data = formatter.format(data);
                }
                return data;
            }
        });
    });

    const Component = (
        <Content>
            {!state.indicators || state.indicators.length < 1 ? (
                <Message messageKey='statsgrid.noResults' />
            ) : (
                <StyledTable
                    columns={columnSettings}
                    dataSource={[...state.indicatorData]}
                    pagination={false}
                />
            )}
        </Content>
    );
    
    if (state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

export const showTableFlyout = (state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.table' />;
    const controls = showFlyout(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <TableFlyout state={state} controller={controller} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <TableFlyout state={state} controller={controller} />
            </LocaleProvider>
        )
    }
};
