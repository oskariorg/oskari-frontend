import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';

const ToolRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
const StyledTool = styled.span`
    padding-right: 5px;
`;

const onToolClick = (event, tool, announcementId) => {
    const cb = tool.getCallback();
    if (typeof cb === 'function') {
        cb(announcementId);
    }
    // Prevent collapse open on tool icon click
    event.stopPropagation();
};

const Tool = ({ tool, announcementId }) => {
    return (
        <Tooltip title={tool.getTooltip()}>
            <StyledTool onClick={(event) => onToolClick(event, tool, announcementId)} >
                {tool.getIconComponent()}
            </StyledTool>
        </Tooltip>);
};

Tool.propTypes = {
    tool: PropTypes.any.isRequired,
    announcementId: PropTypes.number.isRequired
};

export const CollapseTools = ({ tools, announcementId }) => {
    if (!tools.length) {
        return null;
    }
    return (
        <ToolRow>
            {tools.map(tool => (
                <Tool key={tool.getName()} tool={tool} announcementId={ announcementId }/>
            ))}
        </ToolRow>
    );
};

CollapseTools.propTypes = {
    tools: PropTypes.array,
    announcementId: PropTypes.number.isRequired
};
