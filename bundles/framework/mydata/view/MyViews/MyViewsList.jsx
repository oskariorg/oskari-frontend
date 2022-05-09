import React from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { Message, Checkbox, Confirm, Button, Tooltip } from 'oskari-ui';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { red } from '@ant-design/colors';

const EDIT_ICON_STYLE = {
    fontSize: '16px'
};

const DELETE_ICON_STYLE = {
    color: red.primary,
    fontSize: '16px'
};

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

export const MyViewsList = ({ controller, loading, data = [] }) => {
    console.log(data)
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tabs.myviews.grid.default' />,
            dataIndex: 'isDefault',
            sorter: getSorterFor('isDefault'),
            render: (title, item) => {
                return (
                    <Checkbox checked={item.isDefault} onChange={() => controller.setDefaultView(item)} />
                )
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.myviews.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.openView(item)}>{title}</a>
                )
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.myviews.grid.description' />,
            dataIndex: 'description',
            sorter: getSorterFor('description')
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.myviews.grid.createDate' />,
            dataIndex: 'created',
            sorter: getSorterFor('created')
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.myviews.grid.actions' />,
            dataIndex: 'id',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Tooltip title={<Message messageKey='tabs.myviews.grid.edit' />}>
                            <div className='icon t_edit' onClick={() => controller.editView(item)}><EditOutlined style={ EDIT_ICON_STYLE } /></div>
                        </Tooltip>
                        <Confirm
                            title={<Message messageKey='tabs.myviews.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteView(item)}
                            okText={<Message messageKey='tabs.myviews.button.ok' />}
                            cancelText={<Message messageKey='tabs.myviews.button.cancel' />}
                            placement='bottomLeft'
                        >
                            <Tooltip title={<Message messageKey='tabs.myviews.grid.delete' />}>
                                <div className='icon t_delete'><DeleteOutlined style={ DELETE_ICON_STYLE } /></div>
                            </Tooltip>
                        </Confirm>
                    </ToolsContainer>
                )
            }
        }
    ];

    return (
        <StyledTable
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item.id,
                ...item
            }))}
            pagination={false}
            loading={loading}
        />
    )
}

MyViewsList.propTypes = {
    controller: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool.isRequired
}
