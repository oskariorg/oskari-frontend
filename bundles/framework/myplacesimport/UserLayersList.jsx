import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'
import styled from 'styled-components';
import { IconButton } from 'oskari-ui/components/buttons';

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

const DELETE_ICON_STYLE = {
    color: red.primary,
    fontSize: '16px'
};

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
            dataIndex: 'description',
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
                        <Confirm
                            title={<Message messageKey='tab.confirmDeleteMsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteUserLayer(item.key)}
                            okText={<Message messageKey='tab.buttons.ok' />}
                            cancelText={<Message messageKey='tab.buttons.cancel' />}
                            placement='bottomLeft'
                        >
                            <IconButton
                                className='t_delete'
                                title={<Message messageKey='tab.grid.remove' />}
                                icon={<DeleteOutlined style={DELETE_ICON_STYLE} />}
                            />
                        </Confirm>
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <StyledTable
            columns={columnSettings}
            dataSource={data.map(item => ({
                ...item,
                key: item.getId(),
                name: Oskari.util.sanitize(item.getName()),
                description: Oskari.util.sanitize(item.getDescription()),
                source: Oskari.util.sanitize(item.getSource()),
                created: item.getCreated()
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
