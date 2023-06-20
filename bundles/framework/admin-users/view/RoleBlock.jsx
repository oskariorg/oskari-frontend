import React from 'react';
import { TextInput } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const BUTTON = {
    iconSize: 18
};

const Content = styled('div')`
    display: flex;
    flex-direction: row;
    border: 1px solid #999;
    min-height: 50px;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
    font-size: 16px;
    background-color: #F3F3F3;
`;

const ButtonContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

const Button = styled(IconButton)`
    margin-left: 10px;
`;

export const RoleBlock = ({ role, controller, isSystemRole, editingRole }) => {
    const { id, name } = role;
    if (isSystemRole) {
        return (
            <Content>
                <span>{name}</span>
            </Content>
        );
    }
    if (editingRole?.id === id) {
        return (
            <Content>
                <TextInput
                    value={editingRole.name}
                    onChange={(e) => controller.updateEditingRole('name', e.target.value)}
                    status={editingRole.status}
                />
                <ButtonContainer>
                    <Button {...BUTTON} type='ok' onClick={() => controller.updateRole()} />
                    <Button {...BUTTON} type='cancel' onClick={() => controller.setEditingRole(null) } />
                </ButtonContainer>
            </Content>
        );
    }
    return (
        <Content>
            <span>{name}</span>
            <ButtonContainer>
                <Button {...BUTTON} type='edit' onClick={() => controller.setEditingRole(role)} />
                <Button {...BUTTON} type='delete' onConfirm={() => controller.deleteRole(id)} />
            </ButtonContainer>
        </Content>
    );
};
