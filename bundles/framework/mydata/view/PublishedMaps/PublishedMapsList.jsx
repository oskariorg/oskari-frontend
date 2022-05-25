import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';

const openView = (view) => {
    window.open(
        view.url,
        'Published',
        'location=1,status=1,scrollbars=yes,width=850,height=800'
    );
};

export const PublishedMapsList = ({
    controller,
    data = [],
    loading
}) => {
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
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.updateDate' />,
            dataIndex: 'updated',
            sorter: getSorterFor('updated'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.domain' />,
            dataIndex: 'pubDomain',
            sorter: getSorterFor('pubDomain')
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
                    );
                } else {
                    return (
                        <a onClick={() => controller.setPublished(item)}><Message messageKey='tabs.publishedmaps.publish' /></a>
                    );
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
                        <EditIcon onClick={() => controller.editView(item)} />
                        <DeleteButton icon
                            title={<Message messageKey='tabs.publishedmaps.popup.deletemsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteView(item)} />
                    </ToolsContainer>
                );
            }
        }
    ];
    return (
        <Table
            columns={columnSettings}
            dataSource={data.map((item) => ({
                key: item.id,
                ...item
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

PublishedMapsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};
