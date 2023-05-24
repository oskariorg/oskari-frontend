import React, { useState } from 'react';
import { TextInput, Button, Pagination, Message } from 'oskari-ui';
import { PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
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
    margin-bottom: 10px;
    align-self: flex-end;
`;

const EditButton = styled(Button)`
    width: 50px;
`;

const Footer = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-top: 15px;
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

const SearchText = styled('span')`
    font-weight: bold;
`;

export const UsersTab = ({ state, controller, isExternal }) => {
    const [filter, setFilter] = useState('');
    const { userFormState, userPagination, users, roles } = state;
    return (
        <Content>
            {userFormState ? (
                <UserForm
                    userFormState={userFormState}
                    roles={roles}
                    controller={controller}
                    isExternal={isExternal}
                />
            ) : (
                <>
                    <SearchContainer>
                        <TextInput
                            className='t_user_search'
                            prefix={<SearchOutlined />}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            onPressEnter={(e) => controller.search(filter)}
                            autoComplete='nope'
                        />
                        <PrimaryButton
                            type='search'
                            onClick={() => controller.search(filter)}
                        />
                        {userPagination.search && (
                            <SecondaryButton
                                type='reset'
                                onClick={() => {
                                    setFilter('');
                                    controller.resetSearch();
                                }}
                            />
                        )}
                    </SearchContainer>
                    {!isExternal && (
                        <AddButton
                            type='add'
                            onClick={() => controller.setAddingUser()}
                        >
                            <PlusOutlined />
                        </AddButton>
                    )}
                    {userPagination.search && (
                        <SearchText><Message messageKey='flyout.adminusers.searchResults' /> ("{userPagination.search}"):</SearchText>
                    )}
                    {users.map(user => {
                        const { firstName, lastName } = user;
                        const details = firstName || lastName ? ` (${firstName} ${lastName})` : '';
                        return (
                            <UserBlock key={user.id}>
                                <span>{user.user}{details}</span>
                                <EditButton
                                    onClick={() => controller.setEditingUser(user.id)}
                                >
                                    <EditOutlined />
                                </EditButton>
                            </UserBlock>
                        )})
                    }
                    {userPagination.totalCount > userPagination.limit && (
                        <Footer>
                            <Pagination
                                current={userPagination.page}
                                onChange={(page) => controller.setUserPage(page)}
                                simple
                                total={userPagination.totalCount}
                                pageSize={userPagination.limit}
                                showSizeChanger={false}
                            />
                        </Footer>
                    )}
                </>
            )}
        </Content>
    );
};
