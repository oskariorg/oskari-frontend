import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';
import { UserOutlined } from '@ant-design/icons';
import { Block, Button, ButtonContainer } from './styled';

const ADMIN = 'admin';

export const RoleBlock = ({ role, controller, isSystemRole, editingRole }) => {
    const { id, name, type } = role;
    if (isSystemRole) {
        return (
            <Block>
                <span>{name}</span>
                { type === ADMIN &&
                    <Button
                        icon={<UserOutlined />}
                        title={<Message messageKey='roles.showUsers'/>}
                        onClick={() => controller.showUsersByRole(id)} />
                }
            </Block>
        );
    }
    if (editingRole?.id === id) {
        return (
            <Block>
                <TextInput
                    value={editingRole.name}
                    onChange={(e) => controller.updateEditingRole('name', e.target.value)}
                    status={editingRole.status}
                />
                <ButtonContainer>
                    <Button type='accept' onClick={() => controller.updateRole()} />
                    <Button type='reject' onClick={() => controller.setEditingRole(null) } />
                </ButtonContainer>
            </Block>
        );
    }
    return (
        <Block>
            <span>{name}</span>
            <ButtonContainer>
                <Button
                    icon={<UserOutlined />}
                    title={<Message messageKey='roles.showUsers'/>}
                    onClick={() => controller.showUsersByRole(id)} />
                <Button type='edit' onClick={() => controller.setEditingRole(role)} />
                <Button type='delete' onConfirm={() => controller.deleteRole(id)} />
            </ButtonContainer>
        </Block>
    );
};
RoleBlock.propTypes = {
    role: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    editingRole: PropTypes.object,
    isSystemRole: PropTypes.bool
};
