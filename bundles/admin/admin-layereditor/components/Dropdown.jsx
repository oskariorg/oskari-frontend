import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as AntDropdown } from 'antd';

export const Dropdown = ({ children, menu, click = true }) => (
    <AntDropdown overlay={menu} trigger={click ? ['click'] : ['hover']}>
        {click &&
            <a className="ant-dropdown-link" href="#">
                {children}
            </a>
        }
        {!click && children}
    </AntDropdown>
);

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    menu: PropTypes.any.isRequired,
    click: PropTypes.bool
};
