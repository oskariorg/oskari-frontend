import React, { useEffect, useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { ThemedBadge, Message, Collapse, CollapsePanel } from 'oskari-ui';
import { ThemeProvider } from 'oskari-ui/util';
import { getPopupOptions } from '../pluginPopupHelper';

const StyledTable = styled(Table)`
    tr {
        th {
            padding: 8px 8px;
        }
        td {
            padding: 8px;
        }
    }
`;

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

const PopupContent = ({ results, channels, showResult }) => {
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
                <CollapsePanel header={<Header title={channel.locale.name} count={channelResult?.totalCount} />} key={channel.id}>
                    <ChannelContent
                        results={channelResult}
                        channel={channels.find(chan => id === chan.id)}
                        showResult={showResult} />
                </CollapsePanel>
                );
            })}
        </Collapse>
    );
};
const Header = ({ title, count }) => {
    return (<span>{title} <ThemedBadge count={count} showZero /></span>);
};

const ChannelContent = ({ results, channel, showResult }) => {
    if (!results) {
        return null;
    }
    const columnSettings = [
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
            sorter: getSorterFor('type'),
        }
    ];

    const { totalCount, hasMore, locations } = results;
    if (totalCount === 0) {
        return (
            <React.Fragment>
                <Message messageKey={'plugin.SearchPlugin.noresults'} bundleKey='MapModule' />
            </React.Fragment>);
    }
    const msgKey = hasMore ? 'searchMoreResults' : 'searchResultCount';
    return (
        <React.Fragment>
            <Message messageKey={'plugin.SearchPlugin.' + msgKey} messageArgs={{ count: totalCount }} bundleKey='MapModule' />
            <StyledTable
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


export const showResultsPopup = (results = {}, channels = [], showResult, onClose, pluginLocation) => {
    const options = getPopupOptions({
        getName: () => 'searchResults',
        getLocation: () => pluginLocation
    });
    const title = (<Message messageKey='plugin.SearchPlugin.title' bundleKey='MapModule' />);
    const getContent = (results, channels) => {
        return (<ThemeProvider value={options.theme}>
            <PopupContent results={results} channels={channels} showResult={showResult} />
        </ThemeProvider>);
    };
    const opts = showPopup(title, getContent(results, channels), onClose, options);
    return {
        // pass close as is
        ...opts,
        // override update so we can update content by just passing new state
        update: (results, channels) => opts.update(title, getContent(results, channels))
    };
};
