import React from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip, Confirm } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { EditOutlined } from '@ant-design/icons';
import { showSnippetPopup } from './view/embedded/SnippetPopup';
import { DeleteButton } from 'oskari-ui/components/buttons';

const EDIT_ICON_STYLE = {
    fontSize: '14px'
};

const BUNDLE_NAME = 'PersonalData';

const openView = (view) => {
    window.open(
        view.url,
        'Published',
        'location=1,status=1,scrollbars=yes,width=850,height=800'
    );
};

const showHtml = (view, setPopup, closePopup) => {
    const controls = showSnippetPopup(view, closePopup);
    setPopup(controls);
};

export const PublishedMapsList = ({ views = [], handleEdit, handleDelete, handlePublish, showOnMap, setPopup, closePopup }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.name' bundleKey="PersonalData" />,
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
            title: <Message messageKey='tabs.publishedmaps.grid.domain' bundleKey="PersonalData" />,
            dataIndex: 'pubDomain',
            sorter: getSorterFor('pubDomain'),
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.publish' bundleKey="PersonalData" />,
            dataIndex: 'isPublic',
            sorter: getSorterFor('isPublic'),
            render: (title, item) => {
                if (item.isPublic) {
                    return (
                        <Confirm
                            title={<Message messageKey='tabs.publishedmaps.popup.unpublishmsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_NAME} />}
                            onConfirm={() => handlePublish(item)}
                            okText={<Message messageKey='tabs.publishedmaps.button.ok' bundleKey={BUNDLE_NAME} />}
                            cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' bundleKey={BUNDLE_NAME} />}
                            placement='bottomLeft'
                        >
                            <a><Message messageKey='tabs.publishedmaps.unpublish' bundleKey={BUNDLE_NAME} /></a>
                        </Confirm>
                    );
                } else {
                    return (
                        <a onClick={() => handlePublish(item)}><Message messageKey='tabs.publishedmaps.publish' bundleKey={BUNDLE_NAME} /></a>
                    );
                }
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.show' bundleKey="PersonalData" />,
            render: (title, item) => {
                return (
                    <a onClick={() => showOnMap(item)}><Message messageKey='tabs.publishedmaps.show' bundleKey={BUNDLE_NAME} /></a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.html' bundleKey="PersonalData" />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <a onClick={() => showHtml(item, setPopup, closePopup)}><Message messageKey='tabs.publishedmaps.grid.html' bundleKey={BUNDLE_NAME} /></a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.actions' bundleKey="PersonalData" />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Tooltip title={<Message messageKey='tabs.publishedmaps.grid.edit' bundleKey="PersonalData" />}>
                            <div className='icon t_edit' onClick={() => handleEdit(item)}>
                                <EditOutlined style={ EDIT_ICON_STYLE } />
                            </div>
                        </Tooltip>
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='tabs.publishedmaps.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_NAME} />}
                            onConfirm={() => handleDelete(item)}
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <div className="viewsList volatile">
            <Table
                columns={columnSettings}
                dataSource={views.map((item) => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
            />
        </div>
    );
};

PublishedMapsList.propTypes = {
    views: PropTypes.arrayOf(PropTypes.object),
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handlePublish: PropTypes.func.isRequired,
    showOnMap: PropTypes.func.isRequired,
    setPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired
};
