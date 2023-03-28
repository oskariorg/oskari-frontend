import React from 'react';
import styled from 'styled-components';
import { Checkbox, Tooltip } from 'oskari-ui';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const ToolContainer = styled('div')`
    margin: 5px;
    .extraOptions {
        margin-top: 1em;
        margin-left: 2em;
    } 
`;

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const PublisherToolsList = ({ state, controller }) => {
    return (
        <Content>
            {state.tools.map((tool) => (
                <ToolContainer key={tool.id} className='t_tool' data-id={tool.id} data-enabled={tool.tool.isEnabled()}>
                    <ToolCheckbox tool={tool} controller={controller} />
                    { tool.tool.isEnabled() && tool.component &&
                        <div className="t_options extraOptions">
                            <tool.component
                                state={tool.handler.getState()}
                                controller={tool.handler.getController()} />
                        </div>}
                </ToolContainer>
            ))}
        </Content>
    );
};

const ToolCheckbox = ({ tool, controller }) => {
    const toolClass = tool.tool;
    if (toolClass.isDisabled()) {
        return (<Tooltip title={toolClass.getTool().disabledReason}>
            <StyledCheckbox disabled={true} >
                {tool.title}
            </StyledCheckbox>
        </Tooltip>);
    }
    return (
        <StyledCheckbox
            checked={toolClass.isEnabled()}
            onChange={(e) => controller.setToolEnabled(toolClass, e.target.checked)}
        >
            {tool.title}
        </StyledCheckbox>);
};
