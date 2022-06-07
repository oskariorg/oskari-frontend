import React from 'react'
import PropTypes from 'prop-types'
import { Message, Confirm, Tooltip } from 'oskari-ui'
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table'
import { DeleteOutlined, EditOutlined, EyeOutlined, EyeInvisibleOutlined, CopyOutlined, PictureOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'
import styled from 'styled-components';

const DELETE_ICON_STYLE = {
    color: red.primary,
    fontSize: '16px'
};

const ICON_STYLE = {
    fontSize: '16px'
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
            title: <Message messageKey='tabs.publishedmaps.grid.domain' />,
            dataIndex: 'pubDomain',
            sorter: getSorterFor('pubDomain'),
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.createDate' />,
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.updateDate' />,
            dataIndex: 'updated',
            sorter: getSorterFor('updated'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.actions' />,
            dataIndex: 'id',
            width: 150,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Tooltip title={<Message messageKey='tabs.publishedmaps.show' />}>
                            <div className='icon t_show' onClick={() => controller.showOnMap(item)}>
                                <PictureOutlined style={ ICON_STYLE } />
                            </div>
                        </Tooltip>
                        <Tooltip title={<Message messageKey='tabs.publishedmaps.grid.html' />}>
                            <div className='icon t_html' onClick={() => controller.showHtml(item)}>
                                <CopyOutlined style={ ICON_STYLE } />
                            </div>
                        </Tooltip>
                        {item.isPublic ? (
                            <Confirm
                                title={<Message messageKey='tabs.publishedmaps.popup.unpublishmsg' messageArgs={{ name: item.name }} />}
                                onConfirm={() => controller.setPublished(item)}
                                okText={<Message messageKey='tabs.publishedmaps.button.ok' />}
                                cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' />}
                                placement='bottomLeft'
                            >
                                <Tooltip title={<Message messageKey='tabs.publishedmaps.unpublish' />}>
                                    <div className='icon t_unpublish'>
                                        <EyeInvisibleOutlined style={ ICON_STYLE } />
                                    </div>
                                </Tooltip>
                            </Confirm>
                        ) : (
                            <Tooltip title={<Message messageKey='tabs.publishedmaps.publish' />}>
                                <div className='icon t_publish' onClick={() => controller.setPublished(item)}>
                                    <EyeOutlined style={ ICON_STYLE } />
                                </div>
                            </Tooltip>
                        )}
                        <Tooltip title={<Message messageKey='tabs.publishedmaps.grid.edit' />}>
                            <div className='icon t_edit' onClick={() => controller.editView(item)}>
                                <EditOutlined style={ ICON_STYLE } />
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
