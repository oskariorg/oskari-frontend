import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import styled from 'styled-components';
import { IconButton } from 'oskari-ui/components/buttons';

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

export const MyIndicatorsList = ({ controller, indicators = [], loading }) => {
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => <a onClick={() => controller.openIndicator(item)}>{title}</a>
        },
        {
            dataIndex: 'created',
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' />,
            sorter: getSorterFor('created'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            dataIndex: 'updated',
            align: 'left',
            title: <Message messageKey='tab.grid.updateDate' />,
            sorter: getSorterFor('updated'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            dataIndex: 'id',
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            width: 100,
            render: (title, item) => {
                const { id, name } = item;
                return (
                    <ToolsContainer>
                        <IconButton
                            type='edit'
                            onClick={() => controller.editIndicator(id)}
                        />
                        <IconButton
                            type='delete'
                            confirm={{ title: <Message messageKey='tab.confirmDelete' messageArgs={{ name }} /> }}
                            onConfirm={() => controller.deleteIndicator(id)}
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Fragment>
            <ButtonContainer>
                <Button type='primary' onClick={() => controller.addNewIndicator()}>
                    <Message messageKey='userIndicators.add' />
                </Button>
            </ButtonContainer>
            <Table
                columns={columnSettings}
                dataSource={indicators.map(item => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
                loading={loading}
            />
        </Fragment>
    );
};

MyIndicatorsList.propTypes = {
    indicators: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
