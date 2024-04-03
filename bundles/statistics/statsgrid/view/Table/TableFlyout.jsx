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
import { ThemeConsumer } from 'oskari-ui/util';
import { getHeaderTheme } from 'oskari-ui/theme';

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
    .ant-table-selection-col, .ant-table-selection-column {
        display: none;
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

const TableFlyout = ThemeConsumer(({ state, controller, theme }) => {
    const { indicators, activeIndicator, regionset, activeRegion } = state;
    const regions = getRegions(regionset);
    const headerTheme = getHeaderTheme(theme);

    const [sortOrder, setSortOrder] = useState({ column: 'name', order: 'ascend' });

    const changeSortOrder = (column) => {
        let order = 'ascend';
        if (column === sortOrder.column) {
            order = sortOrder.order === 'ascend' ? 'descend' : 'ascend'
        }
        setSortOrder({ column, order });
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
    const getCellStyle = (regionId, hash) => {
        const style = { background: '#ffffff' };
        if (regionId === activeRegion) {
            style.background = headerTheme.getBgColor();
            style.color = headerTheme.getTextColor();
        } else if (activeIndicator === hash) {
            style.background = '#fafafa';
        }
        return { style };
    };
    const getHeaderStyle = (hash) => {
        const style = { background: '#fafafa' };
        if (activeIndicator === hash) {
            style.background = headerTheme.getBgColor();
            style.color = headerTheme.getTextColor();
        }
        return { style };
    };

    columnSettings.push({
        dataIndex: 'name',
        align: 'left',
        width: COLUMN,
        sorter: getSorterFor('name'),
        sortOrder: sortOrder.column === 'name' ? sortOrder.order : null,
        showSorterTooltip: false,
        onCell: (item) => getCellStyle(item.key),
        onHeaderCell: () => getHeaderStyle(),
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
                            column={'name'}
                            sortOrder={sortOrder}
                            changeSortOrder={changeSortOrder} />
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
            return sortOrder.order === 'descend' ? a - b : b - a;
        };
        columnSettings.push({
            dataIndex: [hash, 'formatted'],
            align: 'right',
            width: COLUMN,
            sorter,
            // use descend always for order as we are using own sorter which sorts undefined last
            sortOrder: sortOrder.column === hash ? 'descend' : null,
            showSorterTooltip: false,
            onCell: item => getCellStyle(item.key, hash),
            onHeaderCell: () => getHeaderStyle(hash),
            title: () => {
                return (
                    <HeaderCell>
                        <IndicatorHeader onClick={() => controller.setActiveIndicator(hash)}>
                            <IndicatorName indicator={indicator} />
                        </IndicatorHeader>
                        <HeaderTools>
                            <Sorter
                                column={hash}
                                sortOrder={sortOrder}
                                changeSortOrder={changeSortOrder}/>
                            <StyledRemoveButton
                                type='delete'
                                onClick={() => controller.removeIndicator(indicator)}/>
                        </HeaderTools>
                    </HeaderCell>
                );
            }
        });
    });
    const selectedRowKeys = activeRegion ? [activeRegion] : [];
    return <StyledTable
        pagination={false}
        columns={columnSettings}
        dataSource={dataSource}
        rowSelection={{ selectedRowKeys }}
        onRow={item => ({onClick: () => controller.setActiveRegion(item.key)})} />
});

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
