import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Message, Switch } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { DownloadOutlined, EditOutlined, TableOutlined } from '@ant-design/icons';
import { IconButton, DeleteButton } from 'oskari-ui/components/buttons';
import { FEATURE_EDITOR_TOOLNAME } from './constants';

const ICON_STYLE = {
    fontSize: '16px'
};

const LayerName = styled('div')`
    display: inline-block;
    padding-left: 0.5em;
`;

// const FEATUREDATA_HANDLER_NAME = 'ShowFeatureDataRequest';
function isFeatureDataAvailable() {
    // hide tool for now
    return false;
//    return Oskari.getSandbox().hasHandler(FEATUREDATA_HANDLER_NAME);
}

export const MyFeaturesList = ({ data = [], selectedLayerIds = [], controller, loading }) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return <>
                    <Switch
                        size='small'
                        aria-label={title}
                        checked={selectedLayerIds.some(id => String(id) === String(item.key))}
                        onChange={checked => checked
                            ? controller.addLayerToMap(item.key)
                            : controller.removeLayerFromMap(item.key)}
                    />
                    <LayerName>{title}</LayerName>
                </>;
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.desc' />,
            dataIndex: 'desc',
            sorter: getSorterFor('desc')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.source' />,
            dataIndex: 'source',
            sorter: getSorterFor('source')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' />,
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            width: 135,
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'key',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        { isFeatureDataAvailable() &&
                            <IconButton
                                className='t_edit'
                                title={<Message messageKey='tab.grid.featuredata' />}
                                icon={<TableOutlined style={ICON_STYLE} />}
                                onClick={() => controller.openFeatureData(item.key)}
                            />

                        }
                        <IconButton
                            className='t_edit'
                            title={<Message messageKey='tab.grid.edit' />}
                            icon={<EditOutlined style={ICON_STYLE} />}
                            onClick={() => controller.editLayer(item.key)}
                        />
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='tab.confirmDeleteMsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteLayer(item.key)}
                        />
                        <IconButton
                            title={<Message messageKey='tab.downloadTooltip' messageArgs={{ name: item.name }} />}
                            icon={<DownloadOutlined/>}
                            onClick={(args) => controller.exportLayer(item.key)}
                        />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item.getId(),
                created: item.getCreated(),
                name: item.getName(),
                desc: item.getDescription(),
                source: item.getDataSource(),
                hasFeatureEditorTool: !!item.getFeatureTool(FEATURE_EDITOR_TOOLNAME)
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

MyFeaturesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    selectedLayerIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
