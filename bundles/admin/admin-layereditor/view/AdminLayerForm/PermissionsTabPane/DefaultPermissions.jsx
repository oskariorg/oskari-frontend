import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Message, Confirm, Tooltip } from 'oskari-ui';
import { ROLE_TYPES, SYSTEM_PERMISSIONS, PUBLISHED } from '../../../../util/constants';
import { getDefaultPermisions, hasDefaultPermissions, onlyAdmin } from '../../../../util/rolesHelper';

const Content = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    > * {
        margin-right: 10px;
    }
`;

const ConfirmButton = ({ label, callback, confirm, ...rest }) => {
    if (!confirm) {
        return (
            <Tooltip title={<Message messageKey={`permissions.tooltip.${label}`} />}>
                <Button onClick={callback} { ...rest }>
                    <Message messageKey={`permissions.${label}`} />
                </Button>
            </Tooltip>
        );
    }
    return (
        <Confirm
            placement='bottom'
            title={confirm}
            onConfirm={callback}>
            <Tooltip title={<Message messageKey={`permissions.tooltip.${label}`} />}>
                <Button { ...rest }>
                    <Message messageKey={`permissions.${label}`} />
                </Button>
            </Tooltip>
        </Confirm>
    );
};
ConfirmButton.propTypes = {
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    confirm: PropTypes.any
};

export const DefaultPermissions = ({ metadata, permissions, controller }) => {
    const { systemRoles, roles } = metadata;
    const guest = systemRoles[ROLE_TYPES.GUEST];
    const admin = systemRoles[ROLE_TYPES.ADMIN];
    const system = Object.values(systemRoles);
    const other = roles.filter(({ name }) => !system.includes(name)).map(r => r.name);

    const published = permissions[guest]?.includes(PUBLISHED);
    const countSystem = system.reduce((sum, role) => sum + permissions[role]?.length || 0, 0);
    const countOther = other.reduce((sum, role) => sum + permissions[role]?.length || 0, 0);

    const updatePermissions = (remove, addToRoleType) => {
        let updated = { ...permissions };
        remove.forEach(role => {
            updated[role] = [];
        });
        if (addToRoleType === 'default') {
            const defaults = getDefaultPermisions(systemRoles);
            updated = { ...updated, ...defaults };
        } else if (addToRoleType) {
            const role = systemRoles[addToRoleType];
            updated[role] = [...SYSTEM_PERMISSIONS];
        }
        controller.setPermissions(updated);
    };
    return (
        <Content>
            <ConfirmButton
                label='default'
                type={hasDefaultPermissions(systemRoles, permissions) ? 'primary' : 'default'}
                confirm={countSystem > 0 && <Message messageKey='permissions.confirm.override'/>}
                callback={() => updatePermissions(system, 'default')}/>
            <ConfirmButton
                label='onlyAdmin'
                type={onlyAdmin(permissions, admin, guest) ? 'primary' : 'default'}
                confirm={countSystem > 0 && <Message messageKey='permissions.confirm.override'/>}
                callback={() => updatePermissions(system, ROLE_TYPES.ADMIN)}/>
            <ConfirmButton
                label='published'
                type={published ? 'primary' : 'default'}
                callback={() => controller.togglePermission(guest, PUBLISHED)}/>
            <ConfirmButton
                danger
                label='removeOther'
                type="dashed"
                confirm={countOther > 0 && <Message messageKey='permissions.confirm.remove' messageArgs={{ count: countOther }}/>}
                callback={() => updatePermissions(other)}/>
        </Content>
    );
};

DefaultPermissions.propTypes = {
    metadata: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
