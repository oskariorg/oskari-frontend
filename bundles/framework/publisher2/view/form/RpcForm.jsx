import React from 'react';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const RpcForm = ({ state }) => {
    return (
        <Content>
            {state.tools.map((tool, index) => (
                <tool.component
                    key={index}
                    state={tool.handler.getState()}
                    controller={tool.handler.getController()}
                />
            ))}
        </Content>
    );
};
