import React from 'react'
import PropTypes from 'prop-types'
import { Message, Confirm, Tooltip } from 'oskari-ui'
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'
import styled from 'styled-components';

const DELETE_ICON_STYLE = {
    color: red.primary,
    fontSize: '14px'
};

const EDIT_ICON_STYLE = {
    fontSize: '14px'
};

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

const openView = (view) => {
    window.open(
        view.url,
        'Published',
        'location=1,status=1,scrollbars=yes,width=850,height=800'
    );
}

export const PublishedMapsList = ({ controller, data = [], loading }) => {

    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.name' />,
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
            title: <Message messageKey='tabs.publishedmaps.grid.createDate' />,
            dataIndex: 'createDate',
            sorter: getSorterFor('createDate')
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.updateDate' />,
            dataIndex: 'updateDate',
            sorter: getSorterFor('updateDate')
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.domain' />,
            dataIndex: 'pubDomain',
            sorter: getSorterFor('pubDomain'),
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.publish' />,
            dataIndex: 'isPublic',
            sorter: getSorterFor('isPublic'),
            render: (title, item) => {
                if (item.isPublic) {
                    return (
                        <Confirm
                            title={<Message messageKey='tabs.publishedmaps.popup.unpublishmsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.setPublished(item)}
                            okText={<Message messageKey='tabs.publishedmaps.button.ok' />}
                            cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' />}
                            placement='bottomLeft'
                        >
                            <a><Message messageKey='tabs.publishedmaps.unpublish' /></a>
                        </Confirm>
                    )
                } else {
                    return (
                        <a onClick={() => controller.setPublished(item)}><Message messageKey='tabs.publishedmaps.publish' /></a>
                    )
                }
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.show' />,
            render: (title, item) => {
                return (
                    <a onClick={() => controller.showOnMap(item)}><Message messageKey='tabs.publishedmaps.show' /></a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.html' />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.showHtml(item)}><Message messageKey='tabs.publishedmaps.grid.html' /></a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.actions' />,
            dataIndex: 'id',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Tooltip title={<Message messageKey='tabs.publishedmaps.grid.edit' />}>
                            <div className='icon t_edit' onClick={() => controller.editView(item)}>
                                <EditOutlined style={ EDIT_ICON_STYLE } />
                            </div>
                        </Tooltip>
                        <Confirm
                            title={<Message messageKey='tabs.publishedmaps.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteView(item)}
                            okText={<Message messageKey='tabs.publishedmaps.button.ok' />}
                            cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' />}
                            placement='bottomLeft'
                        >
                            <Tooltip title={<Message messageKey='tabs.publishedmaps.grid.delete' />}>
                                <div className='icon t_delete'><DeleteOutlined style={ DELETE_ICON_STYLE } /></div>
                            </Tooltip>
                        </Confirm>
                    </ToolsContainer>
                );
            }
        }
    ];
    
    return (
        <StyledTable
            columns={columnSettings}
            dataSource={data.map((item) => ({
                key: item.id,
                ...item
            }))}
            pagination={false}
            loading={loading}
        />
    )
}

PublishedMapsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}
