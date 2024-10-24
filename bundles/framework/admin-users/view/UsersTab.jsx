import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchInput, Pagination, Message } from 'oskari-ui';
import styled from 'styled-components';
import { UserForm } from './UserForm';
import { Content, Block, ButtonContainer, Button } from './styled';

const SearchContainer = styled('div')`
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
`;

const Footer = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-top: 15px;
`;

const SearchText = styled('span')`
    font-weight: bold;
`;

export const UsersTab = ({ state, controller, isExternal }) => {
    const [filter, setFilter] = useState('');
    if (state.userFormState) {
        return (
            <Content>
                <UserForm
                    state={state}
                    controller={controller}
                    isExternal={isExternal}
                />
            </Content>
        );
    }
    const { userPagination, users } = state;
    return (
        <Content>
            <SearchContainer>
                <SearchInput
                    className='t_user_search'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onSearch={(search) => controller.search(search)}
                    autoComplete='nope'
                    allowClear
                    enterButton
                />
                {!isExternal && (
                    <Button type='add' bordered onClick={() => controller.setAddingUser()} />
                )}
            </SearchContainer>
            {userPagination.search && (
                <SearchText><Message messageKey='users.searchResults' /> ("{userPagination.search}"):</SearchText>
            )}
            {users.length > 0 && users.map(item => {
                const { id, user, firstName, lastName } = item;
                const details = firstName || lastName ? ` (${firstName} ${lastName})` : '';
                return (
                    <Block key={id}>
                        <span>{user}{details}</span>
                        <ButtonContainer>
                            <Button type='edit' onClick={() => controller.editUserById(id)} />
                            <Button type='delete' onConfirm={() => controller.deleteUser(id)} />
                        </ButtonContainer>
                    </Block>
                );
            })}
            {(!users || users.length === 0) && <Message messageKey='users.noMatch'/>}
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
        </Content>
    );
};
UsersTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    isExternal: PropTypes.bool
};
