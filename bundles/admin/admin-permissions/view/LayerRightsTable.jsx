import React from 'react';
import { Checkbox, Message, Tooltip } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { ThemeConsumer } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
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

const getPermissionTableHeader = (permission) => {
    const translation = <Message messageKey={`rights.${permission.id}`} defaultMsg={permission.name} bundleKey='admin-permissions' />;
    switch (permission.id) {
        case 'VIEW_LAYER':
            return <Tooltip title={translation}><StyledIcon><UnorderedListOutlined /></StyledIcon></Tooltip>
        case 'VIEW_PUBLISHED':
            return <Tooltip title={translation}><StyledIcon><EyeOutlined /></StyledIcon></Tooltip>
        case 'PUBLISH':
            return <Tooltip title={translation}><StyledIcon><ImportOutlined /></StyledIcon></Tooltip>
        case 'DOWNLOAD':
            return <Tooltip title={translation}><StyledIcon><ExportOutlined /></StyledIcon></Tooltip>
        default:
            // permissions might have server side localization as "name" that defaults to id if not given
            return translation;
    }
};

export const LayerRightsTable = ThemeConsumer(({ theme, controller, state }) => {
    const columnSettings = [];
    if (state.permissions?.names) {
        columnSettings.push({
            align: 'left',
            title: <Message messageKey='rights.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name')
        });
        state.permissions.names.forEach((name, index) => {
            columnSettings.push({
                align: 'left',
                title: () => (
                    <HeaderCell>
                        {getPermissionTableHeader(name)}
                        <CheckAllCheckbox
                            checked={state.checkAllCheckboxes[state.pagination.page]?.[name.id]}
                            onChange={() => controller.setCheckAllForPermission(name.id)}
                        />
                    </HeaderCell>
                ),
                dataIndex: 'permissions',
                render: (title, item) => {
                    const tooltip = <span>{state.roles.find(role => role.id === state.selectedRole)?.name}: <Message messageKey={`rights.${name.id}`} defaultMsg={name.name} /></span>;
                    return (
                        <Tooltip getPopupContainer={(triggerNode) => triggerNode.parentElement} title={tooltip}>
                            <Checkbox
                                checked={item.permissions.find(p => p.id === name.id)?.allow}
                                onChange={(e) => controller.togglePermission(item.id, name.id)}
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
