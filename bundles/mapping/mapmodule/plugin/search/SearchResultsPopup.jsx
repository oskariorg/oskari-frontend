import React, { useEffect, useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { Collapse, CollapsePanel, Message, Switch, ThemedBadge, Tooltip } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { ThemeProvider } from 'oskari-ui/util';
import { getPopupOptions } from '../pluginPopupHelper';
import { isSameResult } from './ResultComparator';
import { ChannelTitle } from './components/ChannelTitle';

export const showResultsPopup = (results = {}, channels = [], featuresOnMap = [], showResult, onClose, pluginLocation) => {
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
            <PopupContent results={results} channels={channels} featuresOnMap={featuresOnMap} showResult={showResult} />
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

const PopupContent = ({ results, channels, featuresOnMap, showResult }) => {
    const channelIds = Object.keys(results);
    const mostResultsChannelId = getChannelWithMostResults(channelIds, results);
    const [activeTab, setActiveTab] = useState(mostResultsChannelId);
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
                    <CollapsePanel
                        key={channel.id}
                        header={<Header
                            channel={channel}
                            showGeneric={channelIds.length === 1}
                            count={channelResult?.totalCount} />}>
                        <ChannelContent
                            results={channelResult}
                            channel={channels.find(chan => id === chan.id)}
                            featuresOnMap={featuresOnMap}
                            showResult={showResult} />
                    </CollapsePanel>
                );
            })}
        </Collapse>
    );
};

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
        <ChannelTitle channel={channel} showGeneric={showGeneric} /> <ThemedBadge count={count} showZero />
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

const ChannelContent = ({ results, channel, featuresOnMap, showResult }) => {
    if (!results) {
        return null;
    }
    const columnSettings = [
        {
            align: 'left',
            dataIndex: 'selected',
            title: (<ToggleColumn
                locations={results.locations}
                featuresOnMap={featuresOnMap}
                showResult={showResult} />),
                /*
            sorter: (a, b) => {
                const isSelectedA = featuresOnMap.find(res => isSameResult(res, a));
                const isSelectedB = featuresOnMap.find(res => isSameResult(res, b));
                const nameSorter = getSorterFor('name');
                if (isSelectedA && isSelectedB) {
                    return nameSorter(a,b);
                } else if(isSelectedA) {
                    return -1;
                } else if(isSelectedB) {
                    return 1;
                }
                return nameSorter(a,b);
            },
            */
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

    const { totalCount, hasMore, locations } = results;
    if (totalCount === 0) {
        return (
            <React.Fragment>
                <Message messageKey={'plugin.SearchPlugin.noresults'} bundleKey='MapModule' />
            </React.Fragment>);
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
