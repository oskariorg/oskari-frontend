import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';

const StyledCount = styled.span`
    font-style: italic;
`;

export const UserStylesList = ({ controller, data = [], loading }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.layer' />,
            dataIndex: 'layer',
            sorter: getSorterFor('layer'),
            defaultSortOrder: 'ascend',
            render: (value, { layerId, id }) => <a onClick={() => controller.addLayerToMap(layerId, id)}>{value}</a>
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            render: (value, { count }) => count
                ? <StyledCount>(<Message messageKey='tab.styleCount' messageArgs={{ count }}/>)</StyledCount>
                : value
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
            width: 80,
            render: (id, { count, layerId }) => {
                const isCollection = count > 1;
                const onEdit = isCollection ? () => controller.showLayerStyles(layerId) : () => controller.showStyleEditor(id);
                const deleteTitle = isCollection ? <Message messageKey='tab.styleCount' messageArgs={{ count }}/> : undefined;
                return (
                    <ToolsContainer>
                        <IconButton
                            type='edit'
                            onClick={onEdit}
                        />
                        <IconButton
                            disabled={isCollection}
                            title={deleteTitle}
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
                key: item.layerId,
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
