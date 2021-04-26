import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';

const StyledGroupTool = styled.span`
    padding-right: 5px;
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

const GroupTool = ({ group, tool }) => {
    return (
        <Tooltip title={tool.getTooltip()}>
            <StyledGroupTool onClick={(event) =>
                onToolClick(event, tool, group)} >
                {tool.getIconComponent()}
            </StyledGroupTool>
        </Tooltip>);
};

GroupTool.propTypes = {
    group: PropTypes.any.isRequired,
    tool: PropTypes.any.isRequired
};

export const GroupToolRow = ({ group }) => {
    if (!group || !group.isEditable()) {
        return null;
    }

    return (
        <React.Fragment>
            { group.getTools()
                .filter(t => t.getTypes().includes(group.groupMethod))
                .map((tool) => (
                    <GroupTool key={tool.getName()} group={group} tool={tool} />))
            }
        </React.Fragment>
    );
};

GroupToolRow.propTypes = {
    group: PropTypes.any.isRequired
};
