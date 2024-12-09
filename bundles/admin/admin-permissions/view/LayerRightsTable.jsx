import React from 'react';
import { Checkbox, Message, Tooltip } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { ThemeConsumer } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { LayerIcon } from 'oskari-ui/components/icons';
import { PrimaryButton, ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const StyledTable = styled(Table)`
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
    margin-top: 8px;
`;
const LayerName = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const StyledLayerIcon = styled(LayerIcon)`
    margin-right: 5px;
`;
const Modified = styled.span`
    margin-left: 5px;
    font-size: 22px;
    vertical-align: middle;
`;

const ICON = {
    VIEW_LAYER: <UnorderedListOutlined />,
    VIEW_PUBLISHED: <EyeOutlined />,
    PUBLISH: <ImportOutlined />,
    DOWNLOAD: <ExportOutlined />
};

const getPermissionTableHeader = ({ name, type }) => {
    const translation = <Message messageKey={`rights.${type}`} defaultMsg={name} bundleKey='admin-permissions' />;
    const icon = ICON[type];
    if (!icon) {
        // permissions might have server side localization as "name" that defaults to id if not given
        return translation;
    }
    return <Tooltip title={translation}><StyledIcon>{icon}</StyledIcon></Tooltip>;
};

export const LayerRightsTable = ThemeConsumer(({ theme, controller, state }) => {
    const { permissions, selected, resources, pagination, roles, filtered, loading, unSavedChanges } = state;
    const dataSource = Array.isArray(filtered) ? filtered : resources;
    const roleName = roles.find(r => r.id === selected)?.name || '';

    const handleScroll = (key) => {
        document.querySelector(`[data-row-key="${key}"]`)?.scrollIntoView({ block: 'center' });
    };
    const getVisibleResources = () => {
        const { pageSize, page } = pagination;
        const endIndex = page * pageSize;
        const startIndex = endIndex - pageSize;
        return dataSource.slice(startIndex, endIndex);
    };
    const allChecked = type => {
        return getVisibleResources()
            .every(({ permissions, id }) => (unSavedChanges[id] || permissions[selected])?.includes(type));
    };
    const onCheckAll = (type, enabled) => {
        const ids = getVisibleResources().map(r => r.id);
        controller.setCheckAllForPermission(ids, type, enabled);
    };

    const columnSettings = [];
    if (permissions.length) {
        columnSettings.push({
            align: 'left',
            title: <Message messageKey='flyout.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            render: (title, item) => (
                <LayerName>
                    <StyledLayerIcon type={item.type} hasTimeseries={item.hasTimeseries}/>
                    {title}
                </LayerName>
            )
        });
        permissions.forEach(permission => {
            columnSettings.push({
                align: 'left',
                width: permission.isDefaultType ? '5em' : '10em',
                title: () => {
                    const allCurrentLayersHavePermission = allChecked(permission.type);
                    return (
                        <HeaderCell>
                            {getPermissionTableHeader(permission)}
                            {dataSource.length > 1 && <CheckAllCheckbox
                                checked={allCurrentLayersHavePermission}
                                onChange={() => onCheckAll(permission.type, !allCurrentLayersHavePermission)}
                            /> }
                        </HeaderCell>
                    );
                },
                dataIndex: 'permissions',
                render: (permissions, item) => {
                    const tooltip = <span>{roleName}: <Message messageKey={`rights.${permission.type}`} defaultMsg={permission.name} /></span>;
                    const stored = permissions[selected]?.includes(permission.type) || false;
                    const modified = unSavedChanges[item.id]?.includes(permission.type);
                    const checked = (typeof modified === 'boolean' ? modified : stored) || false;
                    const isModified = typeof modified === 'boolean' && stored !== modified;
                    return (
                        <Tooltip getPopupContainer={(triggerNode) => triggerNode.parentElement} title={tooltip}>
                            <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                    controller.togglePermission(item.id, permission.type, !checked);
                                    handleScroll(item.key);
                                }}
                            />
                            {isModified && <Modified>*</Modified>}
                        </Tooltip>
                    );
                }
            });
        });
    }
    return (
        <div>
            <StyledTable
                columns={columnSettings}
                dataSource={dataSource}
                pagination={{
                    pageSize: pagination.pageSize,
                    hideOnSinglePage: true,
                    simple: true,
                    showSizeChanger: false,
                    current: pagination.page,
                    onChange: (page, pageSize) => controller.setPagination({ page, pageSize })
                }}
                scroll={{ x: 800 }}
                loading={loading}/>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => controller.cancel()}/>
                <PrimaryButton type='save' onClick={controller.savePermissions}/>
            </ButtonContainer>
        </div>
    );
});
