import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { IconButton, DeleteButton } from 'oskari-ui/components/buttons';

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

const editIconStyle = {
    fontSize: '16px'
};

export const MyIndicatorsList = ({ controller, data = [], loading }) => {
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.openIndicator(item)} >{title}</a>
                )
            }
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
                return (
                    <ToolsContainer>
                        <IconButton
                            className='t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={editIconStyle} />}
                            onClick={() => controller.editIndicator(item.id)}
                        />
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='tab.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteIndicator(item.id)}
                        />
                    </ToolsContainer>
                )
            }
        }
    ];

    return (
        <>
            <ButtonContainer>
                <Button type='primary' onClick={() => controller.addNewIndicator()}>
                    <Message messageKey='userIndicators.buttonTitle' />
                </Button>
            </ButtonContainer>
            <Table
                columns={columnSettings}
                dataSource={data.map(item => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
                loading={loading}
            />
        </>
    );
};

MyIndicatorsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
