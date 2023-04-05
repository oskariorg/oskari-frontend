import React from 'react';
import { Tabs, Message } from 'oskari-ui';
import styled from 'styled-components';
import { RolesTab } from './RolesTab';
import { UsersTab } from './UsersTab';

const Content = styled('div')`
`;

export const AdminUsersFlyout = ({ state, controller, isExternal }) => {
    return (
        <Content>
            <Tabs
                activeKey={state.activeTab}
                onChange={(key) => controller.setActiveTab(key)}
                items={[
                    {
                        key: 'admin-users-tab',
                        label: <Message messageKey='flyout.adminusers.title' />,
                        children: (
                            <UsersTab state={state} controller={controller} isExternal={isExternal} />
                        )
                    },
                    {
                        key: 'admin-roles-tab',
                        label: <Message messageKey='flyout.adminroles.title' />,
                        children: (
                            <RolesTab state={state} controller={controller} />
                        )
                    }
                ]}
            />
        </Content>
    );
};
