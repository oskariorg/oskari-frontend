import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Message, Confirm, Tooltip } from 'oskari-ui';
import { ROLE_TYPES, SYSTEM_PERMISSIONS, PUBLISHED } from '../../../../util/constants';
import { getDefaultPermisions, hasDefaultPermissions, onlyAdmin, viewPublished } from '../../../../util/rolesHelper';

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

export const DefaultPermissions = ({ roles, permissions, controller }) => {
    const count = roles.reduce((sum, { name, isSystem }) => {
        const key = isSystem ? 'system' : 'other';
        sum[key] += permissions[name]?.length || 0;
        return sum;
    }, { system: 0, other: 0 });

    const updatePermissions = (removeFrom, addToRoleType) => {
        let updated = { ...permissions };
        const remove = removeFrom === 'system'
            ? roles.filter(r => r.isSystem)
            : roles.filter(r => !r.isSystem);
        remove.forEach(({ name }) => {
            updated[name] = [];
        });
        if (addToRoleType === 'default') {
            const defaults = getDefaultPermisions(roles);
            updated = { ...updated, ...defaults };
        } else if (addToRoleType) {
            const { name } = roles.find(r => r.type === addToRoleType);
            updated[name] = [...SYSTEM_PERMISSIONS];
        }
        controller.setPermissions(updated);
    };
    const togglePublished = () => {
        const guest = roles.find(r => r.type === ROLE_TYPES.GUEST).name;
        controller.togglePermission(guest, PUBLISHED);
    };
    return (
        <Content>
            <ConfirmButton
                label='default'
                type={hasDefaultPermissions(roles, permissions) ? 'primary' : 'default'}
                confirm={count.system > 0 && <Message messageKey='permissions.confirm.override'/>}
                callback={() => updatePermissions('system', 'default')}/>
            <ConfirmButton
                label='onlyAdmin'
                type={onlyAdmin(roles, permissions) ? 'primary' : 'default'}
                confirm={count.system > 0 && <Message messageKey='permissions.confirm.override'/>}
                callback={() => updatePermissions('system', ROLE_TYPES.ADMIN)}/>
            <ConfirmButton
                label='published'
                type={viewPublished(roles, permissions) ? 'primary' : 'default'}
                callback={() => togglePublished()}/>
            <ConfirmButton
                danger={count.other > 0}
                label='removeOther'
                confirm={count.other > 0 && <Message messageKey='permissions.confirm.remove' messageArgs={{ count: count.other }}/>}
                callback={() => updatePermissions()}/>
        </Content>
    );
};

DefaultPermissions.propTypes = {
    roles: PropTypes.array.isRequired,
    permissions: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
