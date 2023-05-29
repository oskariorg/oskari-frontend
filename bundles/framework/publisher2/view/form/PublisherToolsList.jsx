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

export const PublisherToolsList = ({ state, controller }) => {
    return (
        <Content>
            {state.tools.map((tool) => (
                <ToolContainer key={tool.id} className='t_tool' data-id={tool.id} data-enabled={tool.publisherTool.isEnabled()}>
                    <ToolCheckbox tool={tool} controller={controller} />
                    { tool.publisherTool.isEnabled() && tool.component &&
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
    const toolClass = tool.publisherTool;
    if (toolClass.isDisabled()) {
        return (<Tooltip title={toolClass.getTool().disabledReason}>
            <Checkbox disabled={true} >
                {tool.title}
            </Checkbox>
        </Tooltip>);
    }
    return (
        <Checkbox
            checked={toolClass.isEnabled()}
            onChange={(e) => controller.setToolEnabled(toolClass, e.target.checked)}
        >
            {tool.title}
        </Checkbox>);
};
