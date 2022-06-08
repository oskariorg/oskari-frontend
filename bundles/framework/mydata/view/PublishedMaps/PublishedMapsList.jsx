import React from 'react'
import PropTypes from 'prop-types'
import { Message, Confirm } from 'oskari-ui'
import { IconButton } from 'oskari-ui/components/buttons';
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
                        <IconButton
                            className='t_icon t_show'
                            icon={<PictureOutlined style={ICON_STYLE} />}
                            title={<Message messageKey='tabs.publishedmaps.show' />}
                            onClick={() => controller.showOnMap(item)}
                        />
                        <IconButton
                            className='t_icon t_html'
                            icon={<CopyOutlined style={ICON_STYLE} />}
                            title={<Message messageKey='tabs.publishedmaps.grid.html' />}
                            onClick={() => controller.showhtml(item)}
                        />
                        {item.isPublic ? (
                            <Confirm
                                title={<Message messageKey='tabs.publishedmaps.popup.unpublishmsg' messageArgs={{ name: item.name }} />}
                                onConfirm={() => controller.setPublished(item)}
                                okText={<Message messageKey='tabs.publishedmaps.button.ok' />}
                                cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' />}
                                placement='bottomLeft'
                            >
                                <IconButton
                                    className='t_icon t_publish'
                                    icon={<EyeInvisibleOutlined style={ICON_STYLE} />}
                                    title={<Message messageKey='tabs.publishedmaps.unpublish' />}
                                />
                            </Confirm>
                        ) : (
                            <IconButton
                                className='t_icon t_publish'
                                icon={<EyeOutlined style={ICON_STYLE} />}
                                title={<Message messageKey='tabs.publishedmaps.publish' />}
                                onClick={() => controller.setPublished(item)}
                            />
                        )}
                        <IconButton
                            className='t_icon t_edit'
                            icon={<EditOutlined style={ICON_STYLE} />}
                            title={<Message messageKey='tabs.publishedmaps.grid.edit' />}
                            onClick={() => controller.editView(item)}
                        />
                        <Confirm
                            title={<Message messageKey='tabs.publishedmaps.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteView(item)}
                            okText={<Message messageKey='tabs.publishedmaps.button.ok' />}
                            cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' />}
                            placement='bottomLeft'
                        >
                            <IconButton
                                className='t_icon t_delete'
                                icon={<DeleteOutlined style={DELETE_ICON_STYLE} />}
                                title={<Message messageKey='tabs.publishedmaps.grid.delete' />}
                            />
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
