import React from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { Message, Confirm } from 'oskari-ui';
import styled from 'styled-components';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { IconButton } from 'oskari-ui/components/buttons';


const DELETE_ICON_STYLE = {
    fontSize: '16px',
    color: red.primary
};

const EDIT_ICON_STYLE = {
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

const NameField = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const MyPlacesList = ({data = [], loading, controller }) => {

    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.showPlace(item.key)}>
                        <NameField>
                            <div className={`icon myplaces-${item.icon}`} />
                            <span>{title}</span>
                        </NameField>
                    </a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.desc' />,
            dataIndex: 'description',
            sorter: getSorterFor('description')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.measurement' />,
            dataIndex: 'measurement',
            sorter: getSorterFor('measurement')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' />,
            dataIndex: 'createDate',
            sorter: getSorterFor('createDate'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.updateDate' />,
            dataIndex: 'updateDate',
            sorter: getSorterFor('updateDate'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'id',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <IconButton
                            className='t_icon t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={EDIT_ICON_STYLE} />}
                            onClick={() => controller.editPlace(item.key)}
                        />
                        <Confirm
                            title={<Message messageKey='tab.confirm.deletePlace' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deletePlace(item.key)}
                            okText={<Message messageKey='buttons.ok' />}
                            cancelText={<Message messageKey='buttons.cancel' />}
                            placement='bottomLeft'
                        >
                            <IconButton
                                className='t_icon t_delete'
                                title={<Message messageKey='tab.grid.delete' />}
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
            loading={loading}
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item.id,
                ...item.properties,
                createDate: item.createDate,
                updateDate: item.updateDate,
                measurement: item.measurement,
                icon: item.getDrawMode()
            }))}
            pagination={false}
        />
    )
}

MyPlacesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
