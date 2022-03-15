import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'oskari-ui/components/Table';
import { Message, Checkbox, Confirm, Button } from 'oskari-ui';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { red } from '@ant-design/colors';

const BUNDLE_NAME = 'PersonalData';

const DELETE_ICON_STYLE = {
    color: red.primary
};

const StyledTable = styled(Table)`
    a {
        cursor: pointer;
    }
`

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`

export const MyViewsList = ({ data = [], handleEdit, handleDelete, openView, setDefault, saveCurrent }) => {

    const columnSettings = [
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.default' />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <Checkbox checked={item.isDefault} onChange={() => setDefault(item)} />
                )
            }
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.name' />,
            dataIndex: 'name',
            render: (title, item) => {
                return (
                    <a onClick={() => openView(item)}>{title}</a>
                )
            }
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.description' />,
            dataIndex: 'description'
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.edit' />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <a onClick={() => handleEdit(item)}><EditOutlined /></a>
                )
            }
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.delete' />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <Confirm
                        title={<Message messageKey='tabs.myviews.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_NAME} />}
                        onConfirm={() => handleDelete(item)}
                        okText={<Message messageKey='tabs.myviews.button.ok' bundleKey={BUNDLE_NAME} />}
                        cancelText={<Message messageKey='tabs.myviews.button.cancel' bundleKey={BUNDLE_NAME} />}
                        placement='bottomLeft'
                    >
                        <a><DeleteOutlined style={ DELETE_ICON_STYLE } /></a>
                    </Confirm>
                )
            }
        }
    ];

    return (
        <>
            <ButtonContainer>
                <Button type='primary' onClick={saveCurrent}>
                    <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.button.saveCurrent' />
                </Button>
            </ButtonContainer>
            <StyledTable
                columns={columnSettings}
                dataSource={data.map(item => ({
                    key: item.id,
                    ...item
                }))}
                pagination={{ position: ['none', 'bottomCenter'] }}
            />
        </>
    )
}

MyViewsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    openView: PropTypes.func.isRequired,
    setDefault: PropTypes.func.isRequired,
    saveCurrent: PropTypes.func.isRequired
}
