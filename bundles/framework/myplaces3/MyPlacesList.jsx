import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'oskari-ui/components/Table';
import { Message, Confirm } from 'oskari-ui';
import styled from 'styled-components';
import { LOCALE_KEY } from './constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'

const DELETE_ICON_STYLE = {
    color: red.primary
};

const StyledTable = styled(Table)`
    a {
        cursor: pointer;
    }
`;

export const MyPlacesList = ({data = [], handleDelete, handleEdit, showPlace, getGeometryIcon}) => {

    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' bundleKey={LOCALE_KEY} />,
            dataIndex: 'id',
            render: (title, item) => {
                const shape = getGeometryIcon(item.geometry);
                return (
                    <a onClick={() => showPlace(item.geometry, item.categoryId)}>
                        <div className={`icon myplaces-${shape}`} />
                        <span>{item.properties.name}</span>
                    </a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.desc' bundleKey={LOCALE_KEY} />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <span>{item.properties.description}</span>
                )
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' bundleKey={LOCALE_KEY} />,
            dataIndex: 'createDate'
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.updateDate' bundleKey={LOCALE_KEY} />,
            dataIndex: 'updateDate'
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.measurement' bundleKey={LOCALE_KEY} />,
            dataIndex: 'measurement'
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.edit' bundleKey={LOCALE_KEY} />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <a onClick={() => handleEdit(item)}>
                        <EditOutlined />
                    </a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.delete' bundleKey={LOCALE_KEY} />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <Confirm
                        title={<Message messageKey='tab.notification.delete.confirm' messageArgs={{ name: item.properties.name }} bundleKey={LOCALE_KEY} />}
                        onConfirm={() => handleDelete(item)}
                        okText={<Message messageKey='buttons.ok' bundleKey={LOCALE_KEY} />}
                        cancelText={<Message messageKey='buttons.cancel' bundleKey={LOCALE_KEY} />}
                        placement='bottomLeft'
                    >
                        <a><DeleteOutlined style={ DELETE_ICON_STYLE } /></a>
                    </Confirm>
                );
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
            pagination={{ position: ['none', 'bottomCenter'] }}
        />
    )
}

MyPlacesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    showPlace: PropTypes.func.isRequired,
    getGeometryIcon: PropTypes.func.isRequired
};
