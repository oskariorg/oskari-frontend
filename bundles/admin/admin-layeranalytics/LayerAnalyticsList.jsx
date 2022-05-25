import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { Message, Space, Spin, Tooltip } from 'oskari-ui';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';

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
            sorter: getSorterFor('title'),
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
            sorter: getSorterFor('dataProducer'),
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
            sorter: getSorterFor('layerType'),
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
                                <EditIcon onClick={() => layerEditorCallback(item.id)} tooltip={ <Message messageKey='flyout.editLayerTooltip' />}/>
                                <DeleteButton icon
                                    title={<Message messageKey='flyout.removeAllDataForLayer' />}
                                    onConfirm={() => removeAnalyticsCallback(item.id)} />
                            </Space>
                        </TitleArea>
                    </React.Fragment>
                );
            }
        }
    ];

    if (isLoading) {
        return (<Spin/>);
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
