import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as AntDropdown } from 'antd';

export const Dropdown = ({ children, items, placement, click = true }) => {
    const menu = {
        items: items.map((item, index) => ({
            key: `${index}-${item.title}`,
            label: item.title,
            onClick: item.action
        }))
    };

    return (
        <AntDropdown menu={menu} placement={placement} trigger={click ? ['click'] : ['hover']}>
            <span>{children}</span>
        </AntDropdown>
    );
};

Dropdown.propTypes = {
    children: PropTypes.any.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            action: PropTypes.func.isRequired
        })
    ),
    placement: PropTypes.oneOf(['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight']),
    click: PropTypes.bool
};
