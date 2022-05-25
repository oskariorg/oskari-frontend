import React from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { Message, Checkbox, Button } from 'oskari-ui';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const BUNDLE_NAME = 'PersonalData';

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

export const MyViewsList = ({ data = [], handleEdit, handleDelete, openView, setDefault, saveCurrent }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.default' />,
            dataIndex: 'isDefault',
            sorter: getSorterFor('isDefault'),
            render: (title, item) => {
                return (
                    <Checkbox checked={item.isDefault} onChange={() => setDefault(item)} />
                );
            }
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => openView(item)}>{title}</a>
                );
            }
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.description' />,
            dataIndex: 'description',
            sorter: getSorterFor('description')
        },
        {
            align: 'left',
            title: <Message bundleKey={BUNDLE_NAME} messageKey='tabs.myviews.grid.actions' />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <EditIcon onClick={() => handleEdit(item)} />
                        <DeleteButton icon
                            title={<Message messageKey='tabs.myviews.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_NAME} />}
                            onConfirm={() => handleDelete(item)} />
                    </ToolsContainer>
                );
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
            <Table
                columns={columnSettings}
                dataSource={data.map(item => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
            />
        </>
    );
};

MyViewsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    openView: PropTypes.func.isRequired,
    setDefault: PropTypes.func.isRequired,
    saveCurrent: PropTypes.func.isRequired
}
