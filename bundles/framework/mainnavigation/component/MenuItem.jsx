import React from 'react';
import PropTypes from 'prop-types';

export const MenuItem = ({ id, name, tooltip, active, badge }) => {
    const handleClick = () => {
        if (typeof active === 'function') {
            active(id);
        }
    };

    return <button
        type="button"
        title={tooltip}
        onClick={handleClick}
    >
        <span>{name}</span>
        {typeof badge === 'number' ? <span>{badge}</span> : null}
    </button>;
};

MenuItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    active: PropTypes.func,
    badge: PropTypes.number
};
