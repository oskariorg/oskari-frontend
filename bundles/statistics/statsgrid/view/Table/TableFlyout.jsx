import React, { useState } from 'react';
import { Select, Message } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { FlyoutContent } from '../FlyoutContent';
import { Sorter } from './Sorter';
import { IndicatorName } from '../IndicatorName';
import { getRegionsets } from '../../helper/ConfigHelper';
import { getDataByRegions } from '../../helper/StatisticsHelper';
import { getRegions } from '../../helper/RegionsHelper';

const BUNDLE_KEY = 'StatsGrid';
const COLUMN = 200;

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
    margin-right: 10px;
    height: 20px;
`;
const HeaderCell = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`;
const HeaderTools = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    height: 20px;
`;

const TableFlyout = ({ state, controller }) => {
    const { indicators, activeIndicator, regionset } = state;
    const regions = getRegions(regionset);
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
    // every value is set by looping regions => same indexes
    const dataByHash = indicators.reduce((data, ind) => {
        data[ind.hash] = getDataByRegions(ind)
        return data;
    }, {});
    const hashes = indicators.map(ind => ind.hash);
    const dataSource = regions.map(({ id, name }, i) => {
        const data = { key: id, name };
        hashes.forEach(hash => {
            const { value, formatted } = dataByHash[hash][i];
            data[hash] = { value, formatted };
        });
        return data;
    });
    const columnSettings = [];
    const regionsetIds = [];
    indicators.forEach(ind => {
        const sets = ind.allowedRegionsets || [];
        sets.forEach(id => {
            if (!regionsetIds.includes(id)) {
                regionsetIds.push(id);
            }
        });
    });
    columnSettings.push({
        dataIndex: 'name',
        align: 'left',
        width: COLUMN,
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
                                options={getRegionsets()
                                    .filter(rs => regionsetIds.includes(rs.id))
                                    .map(rs => ({ value: rs.id, label: rs.name }))}
                                value={regionset}
                                onChange={(value) => controller.setActiveRegionset(value)}
                            />
                        )}
                    </RegionHeader>
                    <HeaderTools>
                        <Sorter
                            sortOrder={sortOrder['name']}
                            changeSortOrder={() => changeSortOrder('name')} />
                    </HeaderTools>
                </HeaderCell>
            );
        }
    });
    indicators?.forEach(indicator => {
        const { hash } = indicator;
        const sorter = (c1,c2) => {
            const a = c1[hash].value;
            const b = c2[hash].value;
            if (a === b) return 0;
            if (typeof a === 'undefined') return -1;
            if (typeof b === 'undefined') return 1;
            return sortOrder[hash] === 'descend' ? a - b : b - a;
        };
        columnSettings.push({
            dataIndex: [hash, 'formatted'],
            align: 'right',
            width: COLUMN,
            sorter,
            sortOrder: 'descend',
            showSorterTooltip: false,
            onCell: (record, rowIndex) => ({
                style: { background: activeIndicator === hash ? '#fafafa' : '#ffffff' }
            }),
            onHeaderCell: (record, rowIndex) => ({
                style: { background: activeIndicator === hash ? '#f0f0f0' : '#fafafa' }
            }),
            title: () => {
                return (
                    <HeaderCell>
                        <IndicatorHeader onClick={() => controller.setActiveIndicator(hash)}>
                            <IndicatorName indicator={indicator} />
                        </IndicatorHeader>
                        <HeaderTools>
                            <Sorter
                                sortOrder={sortOrder[hash]}
                                changeSortOrder={() => changeSortOrder(hash)}/>
                            <StyledRemoveButton
                                type='delete'
                                onClick={() => controller.removeIndicator(indicator)}/>
                        </HeaderTools>
                    </HeaderCell>
                );
            }
        });
    });

    return <StyledTable columns={columnSettings} dataSource={dataSource} pagination={false}/>
};

export const showTableFlyout = (state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.grid' />;
    const controls = showFlyout(
        title,
        <FlyoutContent state={state}>
            <TableFlyout
                state={state}
                controller={controller}
            />
        </FlyoutContent>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <FlyoutContent state={state}>
                <TableFlyout
                    state={state}
                    controller={controller}
                />
            </FlyoutContent>
        )
    }
};
