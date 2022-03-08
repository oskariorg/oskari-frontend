import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Confirm, Message, Space, Spin, Tooltip } from 'oskari-ui';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DELETE_ICON_STYLE } from './LayerAnalyticsDetails';
import styled from 'styled-components';

import 'antd/es/table/style/index.js';

const TitleArea = styled.span`
    & {
        display: flex;
        justify-content: space-between;
    }
`;

const StyledTable = styled(Table)`
    .ant-table-column-sorter {
        margin: 0 0 0 5px;
    }
`;

const sorterTooltipOptions = {
    title: <Message messageKey='flyout.sorterTooltip' />
};

export const LayerAnalyticsList = ({ analyticsData, isLoading, layerEditorCallback, layerDetailsCallback, removeAnalyticsCallback }) => {
    
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='flyout.idTitle' />,
            dataIndex: 'title',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => Oskari.util.naturalSort(a.title, b.title),
            showSorterTooltip: sorterTooltipOptions,
            render: (title, item) => {
                return (
                    <TitleArea>
                        <Tooltip title={ <Message messageKey='flyout.showDetailsTooltip' /> }>
                            <a onClick={ () => layerDetailsCallback(item.id) } >{ title }</a>
                        </Tooltip>
                    </TitleArea>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.layerDataProvider' />,
            dataIndex: 'dataProducer',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => Oskari.util.naturalSort(a.dataProducer, b.dataProducer),
            showSorterTooltip: sorterTooltipOptions,
            render: (title, item) => {
                return (<TitleArea>{ title }</TitleArea>);
            }
        },
        {
            align: 'left',
            title: 'Type',
            dataIndex: 'layerType',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => Oskari.util.naturalSort(a.layerType, b.layerType),
            showSorterTooltip: sorterTooltipOptions,
            render: (title, item) => {
                return (<TitleArea>{ title }</TitleArea>);
            }
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.totalDisplaysTitle' />,
            dataIndex: 'total',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => a.total - b.total,
            showSorterTooltip: sorterTooltipOptions
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.failurePercentage' />,
            dataIndex: 'failurePercentage',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b, sortOrder) => {
                const rate = a.failurePercentage - b.failurePercentage;
                if (rate !== 0) {
                    return rate;
                }
                if (sortOrder === 'ascend') {
                    // most used, least failures
                    return b.total - a.total;
                }
                // most used, most failures
                return a.total - b.total;
            },
            showSorterTooltip: sorterTooltipOptions,
            render: (title) => <Fragment>{ title }%</Fragment>
        },
        {
            align: 'left',
            key: 'tools',
            render: (title, item) => {
                return (
                    <React.Fragment>
                        <TitleArea>
                            <Space>
                                <Tooltip title={ <Message messageKey='flyout.editLayerTooltip' /> }>
                                    <EditOutlined onClick={ () => layerEditorCallback(item.id) } />
                                </Tooltip>
                                <Confirm
                                    title={<Message messageKey='flyout.removeAllDataForLayer' />}
                                    onConfirm={() => removeAnalyticsCallback(item.id)}
                                    okText={<Message messageKey='flyout.delete' />}
                                    cancelText={<Message messageKey='flyout.cancel' />}
                                    placement='bottomLeft'>
                                    <DeleteOutlined style={ DELETE_ICON_STYLE } />
                                </Confirm>
                            </Space>
                        </TitleArea>
                    </React.Fragment>
                );
            }
        }
    ];

    if (isLoading) {
        return ( <Spin/> );
    }

    return (
        <StyledTable
            columns={ columnSettings }
            dataSource={ analyticsData.map(item => {
                return {
                    key: item.id,
                    ...item
                };
            }) }
            pagination={{ position: ['none', 'bottomCenter'] }}
        />
    );
};

LayerAnalyticsList.propTypes = {
    analyticsData: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    layerEditorCallback: PropTypes.func.isRequired,
    layerDetailsCallback: PropTypes.func.isRequired,
    removeAnalyticsCallback: PropTypes.func.isRequired
};
