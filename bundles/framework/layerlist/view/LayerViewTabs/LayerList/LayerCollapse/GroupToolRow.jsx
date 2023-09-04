import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledGroupTool = styled.span`
    padding-right: 5px;
`;
const ToolPanel = styled.div`
    margin-left: 5px;
`;
const IconContainer = styled.div`
    display: inline-block;
    &:hover {
        color: ${props => props.$hoverColor};
    }
`;

const onToolClick = (event, tool, group) => {
    const id = group.getId();
    const parentId = group.getParentId();
    const groupMethod = group.getGroupMethod();
    const layerCountInGroup = group.getLayers().length;
    const cb = tool.getCallback();
    if (typeof cb === 'function') {
        cb(event, id, groupMethod, layerCountInGroup, parentId);
    }
    // Prevent collapse open on tool icon click
    event.stopPropagation();
};

const GroupTool = ({ group, tool, theme }) => {
    const themeHelper = getNavigationTheme(theme);
    const hoverColor = themeHelper.getButtonHoverColor();

    return (
        <Tooltip title={tool.getTooltip()}>
            <StyledGroupTool onClick={(event) =>
                onToolClick(event, tool, group)} >
                <IconContainer $hoverColor={hoverColor}>
                    {tool.getIconComponent()}
                </IconContainer>
            </StyledGroupTool>
        </Tooltip>);
};

GroupTool.propTypes = {
    group: PropTypes.any.isRequired,
    tool: PropTypes.any.isRequired
};

export const GroupToolRow = ThemeConsumer(({ theme = {}, group }) => {
    if (!group || !group.isEditable()) {
        return null;
    }

    return (
        <ToolPanel>
            { group.getTools()
                .filter(t => t.getTypes().includes(group.groupMethod))
                .map((tool) => (
                    <GroupTool key={tool.getName()} group={group} tool={tool} theme={theme} />))
            }
        </ToolPanel>
    );
});

GroupToolRow.propTypes = {
    group: PropTypes.any.isRequired
};
