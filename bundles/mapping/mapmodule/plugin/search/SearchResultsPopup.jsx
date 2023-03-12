import React, { useEffect, useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { Collapse, CollapsePanel, Message, Switch, ThemedBadge, Tooltip } from 'oskari-ui';
import { ThemeConsumer, ThemeProvider } from 'oskari-ui/util';
import { getHeaderTheme } from 'oskari-ui/theme';
import { getPopupOptions } from '../pluginPopupHelper';
import { isSameResult } from './ResultComparator';
import { ChannelTitle } from './components/ChannelTitle';
import styled from 'styled-components';

export const showResultsPopup = (results = {}, channels = [], featuresOnMap = [], showResult, onClose, pluginLocation, columns) => {
    if (!Object.keys(results).length) {
        // don't open popup until there is something to show
        return null;
    }
    const options = getPopupOptions({
        getName: () => 'searchResults',
        getLocation: () => pluginLocation
    });
    const title = (<Message messageKey='plugin.SearchPlugin.title' bundleKey='MapModule' />);
    const getContent = (results, channels, featuresOnMap) => {
        return (<ThemeProvider value={options.theme}>
            <PopupContent
                results={results}
                channels={channels}
                featuresOnMap={featuresOnMap}
                showResult={showResult}
                columns={columns} />
        </ThemeProvider>);
    };
    const opts = showPopup(title, getContent(results, channels, featuresOnMap), onClose, options);
    return {
        // pass close as is
        ...opts,
        // override update so we can update content by just passing new state
        update: (results, channels, featuresOnMap) => opts.update(title, getContent(results, channels, featuresOnMap))
    };
};

const StyledPanel = styled(CollapsePanel)`
    .ant-collapse-header {
        background-color: ${props => props.$headerColor};
        color: ${props => props.$textColor} !important;
    }
    .ant-collapse-content-box {
        padding-top: 0px;
        padding-left: 0px;
        padding-right: 0px;
    }
`;
const EmptyResult = styled('div')`
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
`;
const BadgeFloater = styled('div')`
float: right;
margin-left: 8px;
`;


const PopupContent = ThemeConsumer(({ results, channels, featuresOnMap, showResult, columns, theme }) => {
    const channelIds = Object.keys(results);
    const mostResultsChannelId = getChannelWithMostResults(channelIds, results);
    const [activeTab, setActiveTab] = useState(mostResultsChannelId);
    const helper = getHeaderTheme(theme);
    useEffect(() => {
        // show the tab with most results if we get additional results after first render
        setActiveTab(mostResultsChannelId);
    }, [mostResultsChannelId]);
    return (
        <Collapse activeKey={activeTab} onChange={setActiveTab}>
            { channelIds.map(id => {
                const channel = channels.find(chan => id === chan.id);
                const channelResult = results[id];
                return (
                    <StyledPanel
                        key={channel.id}
                        $headerColor={helper.getBgColor()}
                        $textColor={helper.getTextColor()}
                        header={<Header
                            channel={channel}
                            showGeneric={channelIds.length === 1}
                            count={channelResult?.totalCount} />}>
                        <ChannelContent
                            results={channelResult}
                            featuresOnMap={featuresOnMap}
                            showResult={showResult}
                            columns={columns} />
                    </StyledPanel>
                );
            })}
        </Collapse>
    );
});

const getChannelWithMostResults = (channelIds = [], results = {}) => {
    const largestResultInIndex = channelIds.reduce((largestIndex, channelId, index) => {
        const prevLargest = channelIds[largestIndex];
        if (results[channelId]?.totalCount > results[prevLargest]?.totalCount) {
            return index;
        }
        return largestIndex;
    }, 0);
    return channelIds[largestResultInIndex];
};

const Header = ({ channel, showGeneric = false, count }) => {
    return (<React.Fragment>
        <ChannelTitle channel={channel} showGeneric={showGeneric} />
        <BadgeFloater>
            <ThemedBadge count={count} showZero />
        </BadgeFloater>
    </React.Fragment>);
};

const ToggleColumn = ({ locations, featuresOnMap, showResult }) => {
    const isSelected = locations.every(loc => !!featuresOnMap.find(res => isSameResult(res, loc)));
    let tooltip = (<Message messageKey='plugin.SearchPlugin.selectResultAll' bundleKey='MapModule' />);
    if (isSelected) {
        tooltip = (<Message messageKey='plugin.SearchPlugin.deselectResultAll' bundleKey='MapModule' />);
    }
    return (
        <Tooltip title={tooltip}>
            <Switch size="small" checked={!!isSelected}
                onChange={checked => {
                    locations.filter(item => checked === !featuresOnMap.find(res => isSameResult(res, item)))
                    .forEach(item => showResult(item, checked))
                }}/>
        </Tooltip>);
};

const ChannelContent = ({ results, featuresOnMap, showResult, columns = [] }) => {
    if (!results) {
        return null;
    }

    const { totalCount, hasMore, locations } = results;
    if (totalCount === 0) {
        return (
            <EmptyResult>
                <Message messageKey={'plugin.SearchPlugin.noresults'} bundleKey='MapModule' />
            </EmptyResult>);
    }

    let columnSettings = [
        {
            align: 'left',
            dataIndex: 'selected',
            title: (<ToggleColumn
                locations={results.locations}
                featuresOnMap={featuresOnMap}
                showResult={showResult} />),
            render: (title, item) => {
                const isSelected = featuresOnMap.find(res => isSameResult(res, item));
                let tooltip = (<Message messageKey='plugin.SearchPlugin.selectResult' bundleKey='MapModule' />);
                if (isSelected) {
                    tooltip = (<Message messageKey='plugin.SearchPlugin.deselectResult' bundleKey='MapModule' />);
                }
                return (
                    <Tooltip title={tooltip}>
                        <Switch size="small" checked={!!isSelected}
                        onChange={checked => showResult(item, checked)}/>
                    </Tooltip>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_name' bundleKey='MapModule' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => showResult(item)}>{title}</a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_village' bundleKey='MapModule' />,
            dataIndex: 'region',
            sorter: getSorterFor('region'),
        },
        {
            align: 'left',
            title: <Message messageKey='plugin.SearchPlugin.column_type' bundleKey='MapModule' />,
            dataIndex: 'type',
            sorter: getSorterFor('type')
        }
    ];
    if (columns.length) {
        columnSettings = columnSettings.filter(c => columns.includes(c.dataIndex));
    }

    return (
        <React.Fragment>
            { hasMore && <Message messageKey={'plugin.SearchPlugin.searchMoreResults'} messageArgs={{ count: totalCount }} bundleKey='MapModule' /> }
            <Table
                columns={columnSettings}
                dataSource={locations.map((item) => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
            />
        </React.Fragment>
    );
};
