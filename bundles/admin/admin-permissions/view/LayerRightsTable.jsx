import React, { useRef } from 'react';
import { Checkbox, Message, Tooltip, Button, Space, TextInput } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { ThemeConsumer } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    max-height: 750px;
    max-width: 850px;
    margin-bottom: 20px;
`;
const StyledIcon = styled('div')`
    font-size: 18px;
`;
const FilterContainer = styled('div')`
    padding: 10px;
`;
const FilterFields = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;
const SearchIcon = styled(SearchOutlined)`
    color: ${props => props.$filtered ? props?.$theme?.color?.accent || '#3c3c3c' : '#bfbfbf'};
    ${props => props.$filtered && ('border-radius: 3px;')}
    font-size: ${props => props.$filtered ? '16px' : '12px'};
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
    const searchInput = useRef(null);
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <FilterContainer onKeyDown={(e) => e.stopPropagation()}>
            <FilterFields>
                <TextInput
                    ref={searchInput}
                    value={selectedKeys[0]}   
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm({ closeDropdown: true })}
                    allowClear
                />
            </FilterFields>
            <Space>
                <Button
                    type="primary"
                    onClick={() => confirm({ closeDropdown: true })}
                    size="small"
                >
                    <Message messageKey='flyout.filter' />
                </Button>
                <SecondaryButton
                    type="clear"
                    onClick={() => {
                        clearFilters();
                        confirm({ closeDropdown: true });
                    }}
                    size="small"
                />
            </Space>
          </FilterContainer>
        ),
        filterIcon: (filtered) => (
          <SearchIcon $filtered={filtered} $theme={theme} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text) => text
    });
    const columnSettings = [];
    if (state.permissions?.names) {
        columnSettings.push({
            align: 'left',
            title: <Message messageKey='rights.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            ...getColumnSearchProps('name')
        });
        state.permissions.names.forEach((name, index) => {
            columnSettings.push({
                align: 'left',
                title: getPermissionTableHeader(name),
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
            dataSource={state.permissions?.resource?.map(r => ({
                key: r.id,
                ...r
            }))}
            pagination={{ defaultPageSize: 50, hideOnSinglePage: true, simple: true }}
            scroll={{ y: 500 }}
            loading={state.loading}
        />
    );
});
