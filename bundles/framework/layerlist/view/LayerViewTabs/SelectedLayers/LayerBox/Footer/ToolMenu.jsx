import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Menu } from 'oskari-ui';
import { THEME_COLOR } from '..';

export const ToolMenu = ({ tools }) => {
    const items = tools.map(tool => {
        return { title: tool._title ? tool._title : tool._name, action: () => true };
    });
    const menu = <Menu items={items} />;
    return (
        <Dropdown menu={menu} placement="bottomRight">
            <Icon type="more" style={{ color: THEME_COLOR, fontSize: '24px' }} />
        </Dropdown>
    );
};
ToolMenu.propTypes = {
    tools: PropTypes.array.isRequired
};
