import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Menu } from 'oskari-ui';
import { THEME_COLOR } from '..';

const getToolTitle = tool => tool.getTooltip() || tool.getTitle() || tool.getName();

export const ToolMenu = ({ tools }) => {
    if (tools.length === 0) {
        return null;
    }
    const items = tools
        .filter(tool => tool.getName() !== 'ownStyle')
        .map(tool => ({ title: getToolTitle(tool), action: tool.getCallback() }));

    const menu = <Menu items={items}/>;
    return (
        <Dropdown menu={menu} placement="bottomRight">
            <Icon type="more" style={{ color: THEME_COLOR, fontSize: '24px' }} />
        </Dropdown>
    );
};
ToolMenu.propTypes = {
    tools: PropTypes.array.isRequired
};
