import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'oskari-ui';
import { THEME_COLOR } from '..';
import { MoreOutlined } from '@ant-design/icons';

const getToolTitle = tool => tool.getTooltip() || tool.getTitle() || tool.getName();

export const ToolMenu = ({ tools = [] }) => {
    const items = tools.filter(tool => tool.getName() !== 'ownStyle')
        .map(tool => ({ title: getToolTitle(tool), action: tool.getCallback() }));
    if (items.length === 0 || Oskari.dom.isEmbedded()) {
        return null;
    }
    return (
        <Dropdown items={items} placement="bottomRight">
            <MoreOutlined style={{ color: THEME_COLOR, fontSize: '24px' }} />
        </Dropdown>
    );
};
ToolMenu.propTypes = {
    tools: PropTypes.array.isRequired
};
