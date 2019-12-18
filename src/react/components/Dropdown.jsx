import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as AntDropdown, Menu } from 'antd';
import 'antd/es/dropdown/style/index.js';
import 'antd/es/menu/style/index.js';

export const Dropdown = ({ children, items, placement, click = true }) => {
    const menu = (
        <Menu>
            {items.map(item => (
                <Menu.Item key={item.title}>
                    <a onClick={item.action}>{item.title}</a>
                </Menu.Item>
            ))}
        </Menu>
    );
    return (
        <AntDropdown overlay={menu} placement={placement} trigger={click ? ['click'] : ['hover']}>
            {children}
        </AntDropdown>
    );
};

Dropdown.propTypes = {
    children: PropTypes.element.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            action: PropTypes.func.isRequired
        })
    ),
    placement: PropTypes.oneOf(['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight']),
    click: PropTypes.bool
};
