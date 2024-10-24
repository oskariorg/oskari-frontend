import React from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';

const ADMIN = 'admin';
const GUEST = 'anonymous';

const getOptionGroup = (type, roles) => {
    const options = roles.map(({ name, id }) => ({ label: name, value: id }));
    return {
        title: type,
        label: <Message messageKey={`roles.types.${type}`} />,
        options
    };
};

export const RoleSelect = ({ state, value, error, multiple, onlyAdmin, onChange }) => {
    const { roles, systemRoles } = state;
    const system = onlyAdmin
        ? systemRoles.filter(role => role.type === ADMIN)
        : systemRoles.filter(role => role.type !== GUEST);
    const options = [
        getOptionGroup('system', system),
        getOptionGroup('other', roles)
    ];
    return <Select
        className='t_roles'
        mode={multiple ? 'multiple' : null}
        status={error ? 'error' : null}
        onChange={(value) => onChange(value)}
        placeholder={<Message messageKey='usersByRole.selectRole' />}
        value={value}
        options={options}/>;
};

RoleSelect.propTypes = {
    state: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    onlyAdmin: PropTypes.bool,
    error: PropTypes.bool
};
