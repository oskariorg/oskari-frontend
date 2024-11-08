import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip, Button } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { ThemeConsumer } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { LayerIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { hasDefaultPermissions, viewPublished, onlyAdmin } from '../../util/rolesHelper';
import { ROLE_TYPES } from '../../util/constants';

const StyledTable = styled(Table)`
    width: 1200px;
    margin-bottom: 20px;
`;
const LayerName = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const StyledLayerIcon = styled(LayerIcon)`
    margin-right: 5px;
`;
const StyledPermission = styled.span`
    margin-right: 5px;
`;
const FILTER = {
    ADMIN: 'adminOnly',
    DEFAULT: 'default',
    OTHERS: 'hasOthers',
    SYSTEM: 'systemOnly',
    UNPUBLISHED: 'unpublished'
};

const ICON = {
    VIEW_LAYER: <UnorderedListOutlined />,
    VIEW_PUBLISHED: <EyeOutlined />,
    PUBLISH: <ImportOutlined />,
    DOWNLOAD: <ExportOutlined />
};

const mapSummaryData = (resource, roles) => {
    const { permissions } = resource;
    // Roles are validated on fetch
    const system = Object.values(ROLE_TYPES)
        .map(type => {
            const { id } = roles.find(r => r.type === type) || {};
            return { id, type };
        })
        .reduce((system, { id, type }) => {
            system[type] = permissions[id] || [];
            return system;
        }, {});

    let filterValue = FILTER.SYSTEM;
    const others = roles.filter(r => !r.isSystem)
        .reduce((others, role) => {
            const count = permissions[role.id]?.length || 0;
            if (count > 0) {
                others.roles++;
                others.permissions += count;
                others.names.push(role.name);
                filterValue = FILTER.OTHERS;
            }
            return others;
        }, { roles: 0, permissions: 0, names: [] });

    if (onlyAdmin(roles, permissions)) {
        filterValue = FILTER.ADMIN;
    } else if (hasDefaultPermissions(roles, permissions)) {
        filterValue = FILTER.DEFAULT;
    }
    return {
        ...resource,
        ...system,
        published: viewPublished(roles, permissions),
        filterValue,
        others
    };
};

const getFilterOptions = () => {
    return Object.values(FILTER)
        .map(value => ({ value, text: Oskari.getMsg('admin-permissions', `flyout.summary.filter.${value}`) }));
};

export const LayerRightsSummary = ThemeConsumer(({ theme, controller, state }) => {
    const { resources, pagination, roles, filtered, loading } = state;
    const [filter, setFilter] = useState(null);
    const dataSource = Array.isArray(filtered) ? filtered : resources;

    const columnSettings = [{
        align: 'left',
        title: <Message messageKey='flyout.name' />,
        dataIndex: 'name',
        sorter: getSorterFor('name'),
        filters: getFilterOptions(),
        filteredValue: filter,
        filterMultiple: false,
        onFilter: (value, item) => value === FILTER.UNPUBLISHED ? !item.published : item.filterValue === value,
        render: (title, item) => (
            <LayerName>
                <StyledLayerIcon type={item.type} hasTimeseries={item.hasTimeseries}/>
                <Button type='link' onClick={() => controller.editLayer(item.id)}>{title}</Button>
            </LayerName>
        )
    }];
    Object.values(ROLE_TYPES).forEach(type => columnSettings.push({
        align: 'left',
        width: '8em',
        title: <Message messageKey={`flyout.summary.${type}`} />,
        dataIndex: type,
        render: (permissions) => {
            return (
                <Fragment>
                    { permissions.map(p => <StyledPermission key={p}>{ICON[p]}</StyledPermission>) }
                </Fragment>
            );
        }
    }));
    columnSettings.push({
        align: 'left',
        width: '15em',
        title: <Message messageKey='flyout.summary.otherRoles' />,
        dataIndex: 'others',
        render: ({ roles, permissions, names }) => {
            if (!roles) {
                return null;
            }
            return (
                <Tooltip title={<Message messageKey='flyout.summary.otherTooltip' messageArgs={{ names: names.join(', ') }}/>}>
                    <Message messageKey='flyout.summary.otherRigthts' messageArgs={{ roles, permissions }}/>
                </Tooltip>
            );
        }
    });

    return (
        <div>
            <StyledTable
                columns={columnSettings}
                dataSource={dataSource.map(resource => mapSummaryData(resource, roles))}
                pagination={{
                    pageSize: pagination.pageSize,
                    hideOnSinglePage: true,
                    simple: true,
                    showSizeChanger: false,
                    current: pagination.page,
                    onChange: (page, pageSize) => controller.setPagination({ page, pageSize })
                }}
                onChange={(pagination, filter) => setFilter(filter.name)}
                scroll={{ x: 800 }}
                loading={loading}/>
        </div>
    );
});
LayerRightsSummary.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
