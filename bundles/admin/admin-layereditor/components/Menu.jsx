import React from 'react';
import PropTypes from 'prop-types';
import { Menu as AntMenu } from 'antd';

export const Menu = ({ items }) => (
    <AntMenu>
        {items.forEach(item => (
            <AntMenu.Item>
                <a onClick={() => item.action}>{item.title}</a>
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
