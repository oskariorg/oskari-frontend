import React from 'react';
import { Select, Message, Spin } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { showFlyout } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled('div')`
    max-height: 850px;
    overflow-y: scroll;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;
const RegionHeader = styled('div')`
    display: flex;
    flex-direction: column;
`;
const IndicatorHeader = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 5px;
    ${props => props.$active && (
        'background-color: #fdf8d9;'
    )}
`;
const StyledRemoveButton = styled(IconButton)`
    margin-left: 10px;
`;

const TableFlyout = ({ state, controller }) => {
    const columnSettings = [
        {
            dataIndex: 'regionName',
            align: 'left',
            sorter: getSorterFor('regionName'),
            title: () => {
                return (
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
                );
            },
            sorter: null,
            defaultSortOrder: 'ascend'
        }
    ];

    state.indicators?.forEach(indicator => {
        columnSettings.push({
            dataIndex: 'data',
            align: 'right',
            sorter: (a, b) => a.data[indicator.hash] - b.data[indicator.hash],
            title: () => {
                return (
                    <IndicatorHeader
                        $active={state.activeIndicator === indicator.hash}
                        onClick={(e) => {
                            e.stopPropagation();
                            controller.setActiveIndicator(indicator.hash);
                        }}
                    >
                        {indicator.labels?.full}
                        <StyledRemoveButton
                            type='delete'
                            onClick={() => controller.removeIndicator(indicator)}
                        />
                    </IndicatorHeader>
                )
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
            <Table
                columns={columnSettings}
                dataSource={state.regions?.map(region => ({
                    key: region.id,
                    regionName: region.name,
                    data: state.indicatorData[region.id]
                }))}
                pagination={false}
            />
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
