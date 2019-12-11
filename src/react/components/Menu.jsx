import React from 'react';
import PropTypes from 'prop-types';
import { Menu as AntMenu } from 'antd';
import 'antd/es/menu/style/index.js';

export const Menu = ({ items }) => (
    <AntMenu>
        {items.map(item => (
            <AntMenu.Item key={item.title}>
                <a onClick={item.action}>{item.title}</a>
            </AntMenu.Item>
        ))}
    </AntMenu>
);

Menu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            action: PropTypes.func.isRequired
        })
    )
};
