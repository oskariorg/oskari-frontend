import React, { useState } from 'react';
import { Select, Message, Spin } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { LocaleProvider } from 'oskari-ui/util';
import { Sorter } from './Sorter';
import { IndicatorName } from '../IndicatorName';
import { getRegionsets } from '../../helper/ConfigHelper';

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
    height: 100%;
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

const getValueSorter = hash => {
    return (a,b) => a.dataByHash[hash] - b.dataByHash[hash];
};

const TableFlyout = ({ state, controller }) => {
    const { indicators, activeIndicator, regionset, loading, regions } = state;
    let initialSort = {
        regionName: null
    };
    indicators?.forEach(indicator => {
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
    // TODO:
    const regionValues = indicators.reduce((data, indicator) => {
        indicator.data.dataByRegions.forEach(region => {
            const {id, value } = region;
            if (!data[id]) {
                data[id] = {};
            }
            data[id][indicator.hash] = value; //TDOO: formatted
        });
        return data;
    }, {});
    const dataSource = regions.map(region => {
        return {
            key: region.id,
            name: region.name,
            dataByHash: regionValues[region.id]
            // TODO: [hash] : value
        };
    })

    const columnSettings = [];

    columnSettings.push({
        dataIndex: 'name',
        align: 'left',
        width: 125,
        sorter: getSorterFor('name'),
        sortOrder: sortOrder['name'],
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
                        {Oskari.dom.isEmbedded() ? (
                            getRegionsets().find(r => r.id === regionset)?.name || ''
                        ) : (
                            <Select
                                filterOption={false}
                                options={getRegionsets().map(rs => ({ value: rs.id, label: rs.name }))}
                                value={regionset}
                                onChange={(value) => controller.setActiveRegionset(value)}
                            />
                        )}
                    </RegionHeader>
                    <Sorter
                        sortOrder={sortOrder['name']}
                        changeSortOrder={() => changeSortOrder('name')}
                    />
                </HeaderCell>
            );
        }
    });
    indicators?.forEach(indicator => {
        columnSettings.push({
            dataIndex: 'value', //indicator.hash
            align: 'right',
            width: 125,
            sorter: getValueSorter(indicator.hash),
            sortOrder: sortOrder[indicator.hash],
            showSorterTooltip: false,
            onCell: (record, rowIndex) => ({
                style: { background: activeIndicator === indicator.hash ? '#fafafa' : '#ffffff' }
            }),
            onHeaderCell: (record, rowIndex) => ({
                style: { background: activeIndicator === indicator.hash ? '#f0f0f0' : '#fafafa' }
            }),
            title: () => {
                return (
                    <HeaderCell>
                        <IndicatorHeader
                            onClick={(e) => {
                                controller.setActiveIndicator(indicator.hash);
                            }}
                        >
                            <IndicatorName indicator={indicator} />
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
                const value = item.dataByHash[indicator.hash] || '';
                if (typeof value === 'number') {
                    const formatter = Oskari.getNumberFormatter(indicator?.classification?.fractionDigits);
                    return formatter.format(value);
                }
                return value;
            }
        });
    });

    const Component = (
        <Content>
            {!indicators || indicators.length < 1 ? (
                <Message messageKey='statsgrid.noResults' />
            ) : (
                <StyledTable
                    columns={columnSettings}
                    dataSource={dataSource}
                    pagination={false}
                />
            )}
        </Content>
    );
    
    if (loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

export const showTableFlyout = (state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.grid' />;
    const controls = showFlyout(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <TableFlyout
                state={state}
                controller={controller}
            />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <TableFlyout
                    state={state}
                    controller={controller}
                />
            </LocaleProvider>
        )
    }
};
