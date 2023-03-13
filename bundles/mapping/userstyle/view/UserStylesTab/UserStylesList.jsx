import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';

export const UserStylesList = ({ controller, data = [], loading }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.layer' />,
            dataIndex: 'layer',
            sorter: getSorterFor('layer'),
            defaultSortOrder: 'ascend'
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.created' />,
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            width: 135,
            render: value => Oskari.util.formatDate(value)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.updated' />,
            dataIndex: 'updated',
            sorter: getSorterFor('updated'),
            width: 135,
            render: value => Oskari.util.formatDate(value)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'id',
            width: 150,
            render: (id) => {
                return (
                    <ToolsContainer>
                        <IconButton
                            type='edit'
                            onClick={() => controller.showStyleEditor(id) }
                        />
                        <IconButton
                            type='delete'
                            onConfirm={() => controller.deleteStyle(id) }
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            columns={columnSettings}
            dataSource={data.map((item) => ({
                key: item.id,
                ...item
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

UserStylesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};
