import React from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';

const NameField = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const MyPlacesList = ({
    data = [],
    loading,
    controller
}) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                const shape = controller.getGeometryIcon(item._place.geometry);
                return (
                    <a onClick={() => controller.showPlace(item._place.geometry, item._place.categoryId)}>
                        <NameField>
                            <div className={`icon myplaces-${shape}`} />
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
            title: <Message messageKey='tab.grid.createDate' />,
            dataIndex: 'createDate',
            sorter: getSorterFor('createDate'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.updateDate' />,
            dataIndex: 'updateDate',
            sorter: getSorterFor('updateDate'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.measurement' />,
            dataIndex: 'measurement',
            sorter: getSorterFor('measurement')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'id',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <EditIcon onClick={() => controller.editPlace(item._place)} />
                        <DeleteButton icon
                            title={<Message messageKey='tab.notification.delete.confirm' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deletePlace(item._place)} />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            loading={loading}
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item.id,
                ...item.properties,
                createDate: item.createDate,
                updateDate: item.updateDate,
                measurement: item.measurement,
                _place: item
            }))}
            pagination={false}
        />
    );
};

MyPlacesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
