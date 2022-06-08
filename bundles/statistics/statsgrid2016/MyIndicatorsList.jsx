import React from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Button } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors';
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

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

const deleteIconStyle = {
    fontSize: '16px',
    color: red.primary
};

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
            defaultSortOrder: 'ascend'
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
                            className='t_icon t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={editIconStyle} />}
                            onClick={() => controller.editIndicator(item)}
                        />
                        <Confirm
                            title={<Message messageKey='tab.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteIndicator(item)}
                            okText={<Message messageKey='tab.button.ok' />}
                            cancelText={<Message messageKey='tab.button.cancel' />}
                            placement='bottomLeft'
                        >
                            <IconButton
                                className='t_icon t_delete'
                                title={<Message messageKey='tab.grid.delete' />}
                                icon={<DeleteOutlined style={deleteIconStyle} />}
                            />
                        </Confirm>
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
            <StyledTable
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
