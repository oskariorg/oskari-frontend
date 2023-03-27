import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'oskari-ui';

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
                    <StyledCheckbox
                        checked={tool.tool.isEnabled()}
                        onChange={(e) => controller.setToolEnabled(tool.tool, e.target.checked)}
                    >
                        {tool.title}
                    </StyledCheckbox>
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
