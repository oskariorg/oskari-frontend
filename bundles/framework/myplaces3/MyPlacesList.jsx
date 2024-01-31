import React from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { IconButton, DeleteButton } from 'oskari-ui/components/buttons';

const EDIT_ICON_STYLE = {
    fontSize: '16px'
};

const NameField = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const MyPlacesList = ({ data = [], loading, controller }) => {
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
                            className='t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={EDIT_ICON_STYLE} />}
                            onClick={() => controller.editPlace(item.key)}
                        />
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='tab.confirm.deletePlace' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deletePlace(item.key)}
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            pagination={{ defaultPageSize: 10, hideOnSinglePage: true, simple: true }}
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
        />
    );
};

MyPlacesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
