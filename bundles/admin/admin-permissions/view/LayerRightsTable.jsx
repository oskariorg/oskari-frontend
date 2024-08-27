import React from 'react';
import { Checkbox, Message, Tooltip } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { ThemeConsumer } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { LayerIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    max-height: 750px;
    max-width: 850px;
    margin-bottom: 20px;
`;
const StyledIcon = styled('div')`
    font-size: 18px;
`;
const HeaderCell = styled('div')`
    display: flex;
    flex-direction: column;
`;
const CheckAllCheckbox = styled(Checkbox)`
    margin-top: 10px;
`;
const LayerName = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const StyledLayerIcon = styled(LayerIcon)`
    margin-right: 5px;
`;

const preferredOrder = ['VIEW_LAYER', 'VIEW_PUBLISHED', 'PUBLISH', 'DOWNLOAD'];
const getPermissionNames = (nameToLabel) => {
    if (!nameToLabel) {
        return [];
    }
    // move the recognized permissionTypes to the front with additional styles in random order
    const names = preferredOrder.filter(type => !!nameToLabel[type]);
    const additionalNames = Object.keys(nameToLabel).filter(type => !names.includes(type));
    return [...names, ...additionalNames];
};

const VIEW_LAYER = 'VIEW_LAYER';
const VIEW_PUBLISHED = 'VIEW_PUBLISHED';
const PUBLISH = 'PUBLISH';
const DOWNLOAD = 'DOWNLOAD';

const DEFAULT_PERMISSIONS = [VIEW_LAYER, VIEW_PUBLISHED, PUBLISH, DOWNLOAD];
const isDefaultPermissionType = (permissionName) => {
    return DEFAULT_PERMISSIONS.includes(permissionName);
};

const getPermissionTableHeader = (permissionType, permissionName) => {
    const translation = <Message messageKey={`rights.${permissionType}`} defaultMsg={permissionName} bundleKey='admin-permissions' />;
    switch (permissionType) {
        case VIEW_LAYER:
            return <Tooltip title={translation}><StyledIcon><UnorderedListOutlined /></StyledIcon></Tooltip>
        case VIEW_PUBLISHED:
            return <Tooltip title={translation}><StyledIcon><EyeOutlined /></StyledIcon></Tooltip>
        case PUBLISH:
            return <Tooltip title={translation}><StyledIcon><ImportOutlined /></StyledIcon></Tooltip>
        case DOWNLOAD:
            return <Tooltip title={translation}><StyledIcon><ExportOutlined /></StyledIcon></Tooltip>
        default:
            // permissions might have server side localization as "name" that defaults to id if not given
            return translation;
    }
};

export const LayerRightsTable = ThemeConsumer(({ theme, controller, state }) => {
    const handleScroll = (key) => {
        document.querySelector(`[data-row-key="${key}"]`)?.scrollIntoView({block: 'center'});
    };
    const hasPermission = (layer, permissionType) => {
        return layer.permissions[state.selectedRole]?.findIndex(p => p === permissionType) > -1;
    };
    const allChecked = (permissionType) => {
        let checked = true;
        const startIndex = (state.pagination.page - 1) * state.pagination.pageSize;
        const endIndex = state.pagination.pageSize * state.pagination.page;
        state.resources
            .filter((layer, index) => index >= startIndex && index < endIndex)
            .forEach(layer => {
                if (!hasPermission(layer, permissionType)) {
                    checked = false;
                }
            });
        return checked;
    };

    const mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');

    const columnSettings = [];
    const permissionNames = getPermissionNames(state.permissions?.names);
    if (permissionNames.length) {
        columnSettings.push({
            align: 'left',
            title: <Message messageKey='rights.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            render: (title, item) => {
                const layer = mapLayerService.findMapLayer(item.id);
                let layerType = item.layerType;
                if (layerType !== 'analysislayer' && layerType !== 'userlayer' && layerType?.includes('layer')) {
                    // Change 'wmslayer' to 'wms' etc. for translations & icons
                    layerType = layerType.replace('layer', '');
                }
                return (
                    <LayerName>
                        {layerType && (
                            <StyledLayerIcon
                                type={layerType}
                                hasTimeseries={layer?.hasTimeseries()}
                            />
                        )}
                        {title}
                    </LayerName>
                )
            }
        });
        permissionNames.forEach((permissionType, index) => {
            const permissionName = state.permissions.names[permissionType];
            columnSettings.push({
                align: 'left',
                width: isDefaultPermissionType(permissionName) ? '5em' : '10em',
                title: () => {
                    const allCurrentLayersHavePermission = allChecked(permissionType);
                    return (
                        <HeaderCell>
                            {getPermissionTableHeader(permissionType, permissionName)}
                            <CheckAllCheckbox
                                checked={allCurrentLayersHavePermission}
                                onChange={() => controller.setCheckAllForPermission(permissionType, !allCurrentLayersHavePermission)}
                            />
                        </HeaderCell>
                    );
                },
                dataIndex: 'permissions',
                render: (title, item) => {
                    const tooltip = <span>{state.roles.find(role => role.id === state.selectedRole)?.name}: <Message messageKey={`rights.${permissionType}`} defaultMsg={state.permissions.names[permissionType]} /></span>;
                    const checked = item.permissions[state.selectedRole]?.findIndex(p => p === permissionType) > -1;
                    return (
                        <Tooltip getPopupContainer={(triggerNode) => triggerNode.parentElement} title={tooltip}>
                            <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                    controller.togglePermission(item.id, permissionType, !checked);
                                    handleScroll(item.key);
                                }}
                            />
                        </Tooltip>
                    );
                }
            });
        });
    }

    return (
        <StyledTable
            columns={columnSettings}
            dataSource={state.resources?.map(r => ({
                key: r.id,
                ...r
            }))}
            pagination={{
                defaultPageSize: state.pagination.pageSize,
                hideOnSinglePage: true,
                simple: true,
                current: state.pagination.page,
                onChange: (page) => controller.setPage(page)
            }}
            scroll={{ y: 500 }}
            loading={state.loading}
        />
    );
});
