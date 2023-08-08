import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { EditOutlined } from '@ant-design/icons';
import { IconButton, DeleteButton } from 'oskari-ui/components/buttons';

const EDIT_ICON_STYLE = {
    fontSize: '16px'
};

export const UserLayersList = ({ data = [], controller, loading }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.openLayer(item.key)}>{title}</a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.description' />,
            dataIndex: 'desc',
            sorter: getSorterFor('description')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.source' />,
            dataIndex: 'source',
            sorter: getSorterFor('source')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' />,
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'key',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <IconButton
                            className='t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={EDIT_ICON_STYLE} />}
                            onClick={() => controller.editUserLayer(item.key)}
                        />
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='tab.confirmDeleteMsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteUserLayer(item.key)}
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            columns={columnSettings}
            dataSource={data.map(item => ({
                ...item,
                key: item.getId(),
                created: item.getCreated(),
                ...item.getLocaleValues()
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

UserLayersList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
