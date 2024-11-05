import React from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';
import { ROLE_TYPES } from '../../../admin/util/constants';

const getOptions = (roles, onlyAdmin) => {
    const { system = [], additional = [] } = roles;
    const filtered = onlyAdmin
        ? system.filter(role => role.type === ROLE_TYPES.ADMIN)
        : system.filter(role => role.type !== ROLE_TYPES.GUEST);
    return [{
        title: 'system',
        label: <Message messageKey='roles.types.system' />,
        options: filtered.map(r => ({ label: r.name, value: r.id }))
    }, {
        title: 'other',
        label: <Message messageKey='roles.types.other' />,
        options: additional.map(r => ({ label: r.name, value: r.id }))
    }];
};

export const RoleSelect = ({ state, value, error, multiple, onlyAdmin, onChange }) => {
    return <Select
        className='t_roles'
        mode={multiple ? 'multiple' : null}
        status={error ? 'error' : null}
        onChange={(value) => onChange(value)}
        placeholder={<Message messageKey='usersByRole.selectRole' />}
        value={value}
        style={multiple ? { width: 210 } : null}
        options={getOptions(state.roles, onlyAdmin)}/>;
};

RoleSelect.propTypes = {
    state: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    onlyAdmin: PropTypes.bool,
    error: PropTypes.bool
};
