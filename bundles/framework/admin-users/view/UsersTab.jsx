import React, { useState } from 'react';
import { TextInput, Button } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { UserForm } from './UserForm';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const SearchContainer = styled('div')`
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;    
`;

const AddButton = styled(PrimaryButton)`
    width: 50px;
    margin-bottom: 10px;
    align-self: flex-end;
`;

const EditButton = styled(Button)`
    width: 50px;
`;

const UserBlock = styled('div')`
    display: flex;
    flex-direction: row;
    border: 1px solid #999;
    min-height: 50px;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
    font-size: 16px;
    background-color: #F3F3F3;
`;

export const UsersTab = ({ state, controller, isExternal }) => {
    const [filter, setFilter] = useState('');
    const hasFilter = state.userFilter !== null && state.userFilter !== undefined && state.userFilter.length > 0;
    let users = !hasFilter ? state.users : state.users.filter(user => 
        (user.firstName && user.firstName.toLowerCase().indexOf(state.userFilter.toLowerCase()) > -1) ||
        (user.lastName && user.lastName.toLowerCase().indexOf(state.userFilter.toLowerCase()) > -1) ||
        (user.user && user.user.toLowerCase().indexOf(state.userFilter.toLowerCase()) > -1));
    return (
        <Content>
            {state.addingUser || state.editingUserId ? (
                <UserForm
                    state={state}
                    controller={controller}
                    isExternal={isExternal}
                />
            ) : (
                <>
                    <SearchContainer>
                        <TextInput
                            className='t_user_search'
                            allowClear
                            prefix={<SearchOutlined />}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <PrimaryButton
                            type='search'
                            onClick={() => controller.setUserFilter(filter)}
                        />
                    </SearchContainer>
                    {!isExternal && (
                        <AddButton
                            type='add'
                            onClick={() => controller.setAddingUser()}
                        >
                            <PlusOutlined />
                        </AddButton>
                    )}
                    {users.map(user => (
                        <UserBlock key={user.id}>
                            <span>{user.user} ({user.firstName} {user.lastName})</span>
                            <EditButton
                                onClick={() => controller.setEditingUserId(user.id)}
                            >
                                <EditOutlined />
                            </EditButton>
                        </UserBlock>
                    ))}
                </>
            )}
        </Content>
    );
};
