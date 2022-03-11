import React from 'react'
import { Message, Confirm } from 'oskari-ui'
import { Table } from 'oskari-ui/components/Table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { red } from '@ant-design/colors'
import styled from 'styled-components';
import { showHTMLrender } from './view/HTMLrender/HTMLrender'

const DELETE_ICON_STYLE = {
    color: red.primary
};

const StyledTable = styled(Table)`
    a {
        cursor: pointer;
    }
`

const BUNDLE_NAME = 'PersonalData';

export const PublishedMapsList = ({ views, handleEdit, handleDelete, handlePublish, showOnMap, setPopup, closePopup }) => {

    const showHtml = (view) => {
        const url = Oskari.getSandbox().createURL(view.url);
        const size = view.metadata && view.metadata.size ? view.metadata.size : undefined;
        const width = size ? size.width + 'px' : '100%';
        const height = size ? size.height + 'px' : '100%';
        let iframeCode = '<iframe src="' + url + '" allow="geolocation" style="border: none;';
        if (width !== null && width !== undefined) {
            iframeCode += ' width: ' + width + ';';
        }
        if (height !== null && height !== undefined) {
            iframeCode += ' height: ' + height + ';';
        }
        iframeCode += '"></iframe>';
        const values = {
            html: iframeCode
        };
        
        const controls = showHTMLrender(values, closePopup);
        setPopup(controls);
    }

    const openView = (view) => {
        window.open(
            view.url,
            'Published',
            'location=1,status=1,scrollbars=yes,width=850,height=800'
        );
    }

    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.name' bundleKey="PersonalData" />,
            dataIndex: 'name',
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
            render: (title, item) => {
                return (
                    <span>{title}</span>
                )
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.publish' bundleKey="PersonalData" />,
            dataIndex: 'isPublic',
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
                    )
                } else {
                    return (
                        <a onClick={() => handlePublish(item)}><Message messageKey='tabs.publishedmaps.publish' bundleKey={BUNDLE_NAME} /></a>
                    )
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
                    <a onClick={() => showHtml(item)}><Message messageKey='tabs.publishedmaps.grid.html' bundleKey={BUNDLE_NAME} /></a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.edit' bundleKey="PersonalData" />,
            dataIndex: 'id',
            render: (title, item) => {

                return (
                    <a onClick={() => handleEdit(item)}>
                        <EditOutlined />
                    </a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tabs.publishedmaps.grid.delete' bundleKey="PersonalData" />,
            dataIndex: 'id',
            render: (title, item) => {
                return (
                    <Confirm
                        title={<Message messageKey='tabs.publishedmaps.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_NAME} />}
                        onConfirm={() => handleDelete(item)}
                        okText={<Message messageKey='tabs.publishedmaps.button.ok' bundleKey={BUNDLE_NAME} />}
                        cancelText={<Message messageKey='tabs.publishedmaps.button.cancel' bundleKey={BUNDLE_NAME} />}
                        placement='bottomLeft'
                    >
                        <a><DeleteOutlined style={ DELETE_ICON_STYLE } /></a>
                    </Confirm>
                );
            }
        },
    ];
    
    return (
        <div className="viewsList volatile">
            <StyledTable
                columns={columnSettings}
                dataSource={views?.map((item) => ({
                    key: item.id,
                    ...item
                }))}
                pagination={{ position: ['none', 'none'] }}
            />
        </div>
    )
}
