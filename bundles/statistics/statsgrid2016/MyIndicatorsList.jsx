import React from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Button, Tooltip } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors';
import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

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
            title: <Message messageKey='tab.grid.name' bundleKey={BUNDLE_KEY} />,
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend'
        },
        {
            dataIndex: 'created',
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' bundleKey={BUNDLE_KEY} />,
            sorter: getSorterFor('created'),
        },
        {
            dataIndex: 'id',
            align: 'left',
            title: <Message messageKey='tab.grid.actions' bundleKey={BUNDLE_KEY} />,
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Tooltip title={<Message bundleKey={BUNDLE_KEY} messageKey='tab.grid.edit' />}>
                            <div className='icon t_edit' onClick={() => controller.editIndicator(item)}>
                                <EditOutlined style={editIconStyle} />
                            </div>
                        </Tooltip>
                        <Confirm
                            title={<Message messageKey='tab.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_KEY} />}
                            onConfirm={() => controller.deleteIndicator(item)}
                            okText={<Message messageKey='tab.button.ok' bundleKey={BUNDLE_KEY} />}
                            cancelText={<Message messageKey='tab.button.cancel' bundleKey={BUNDLE_KEY} />}
                            placement='bottomLeft'
                        >
                            <Tooltip title={<Message bundleKey={BUNDLE_KEY} messageKey='tab.grid.delete' />}>
                                <div className='icon t_delete'>
                                    <DeleteOutlined style={deleteIconStyle} />
                                </div>
                            </Tooltip>
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
                    <Message bundleKey={BUNDLE_KEY} messageKey='userIndicators.buttonTitle' />
                </Button>
            </ButtonContainer>
            <StyledTable
                columns={columnSettings}
                dataSource={data.map(item => ({
                    key: item.id,
                    ...item,
                    created: Oskari.util.formatDate(item.created)
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
