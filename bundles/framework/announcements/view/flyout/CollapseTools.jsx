import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { Tooltip } from 'oskari-ui';

const ToolRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
const StyledTool = styled.span`
    padding-right: 5px;
`;
const Tool = ({ tool, announcementId }) => {
    const Component = tool.getComponent();
    const name = tool.getName();
    const callback = tool.getCallback();
    // Delete tool doesn't have component and callback has to called on confirm
    if (name === 'announcements-delete') {
        return (
            <DeleteButton icon onConfirm = { () => callback(announcementId) } tooltip={tool.getTooltip()}/>
        );
    }
    return (
        <Tooltip title={tool.getTooltip()}>
            <Component
                className={`t_${name}-${announcementId}`}
                onClick = { () => callback(announcementId) }
            />
        </Tooltip>
    );
};

Tool.propTypes = {
    tool: PropTypes.any.isRequired,
    announcementId: PropTypes.number.isRequired
};

export const CollapseTools = ({ tools = [], announcementId }) => {
    if (!tools.length) {
        return null;
    }
    return (
        <ToolRow onClick={(event) => event.stopPropagation()}>
            {tools.map(tool => (
                <StyledTool key={tool.getName()}>
                    <Tool tool={tool} announcementId={ announcementId }/>
                </StyledTool>
            ))}
        </ToolRow>
    );
};

CollapseTools.propTypes = {
    tools: PropTypes.array,
    announcementId: PropTypes.number.isRequired
};
