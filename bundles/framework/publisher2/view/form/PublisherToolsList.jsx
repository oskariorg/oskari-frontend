import React from 'react';
import PropTypes from 'prop-types';
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

export const PublisherToolsList = ({ tools, controller }) => {
    const visibleTools = tools.filter(tool => tool.isDisplayed());
    if (!visibleTools.length) {
        return null;
    }
    const group = visibleTools[0].getGroup();
    return (
        <Content className={`t_tools t_${group}`}>
            {visibleTools.map((tool) => {
                const { id } = tool.getTool();
                return (
                    <ToolContainer key={id} className='t_tool' data-id={id} data-enabled={tool.isEnabled()}>
                        <ToolCheckbox tool={tool} controller={controller} />
                        <ToolExtra tool={tool} />
                    </ToolContainer>
                );
            })}
        </Content>
    );
};
PublisherToolsList.propTypes = {
    tools: PropTypes.array.isRequired,
    controller: PropTypes.object.isRequired
};

const ToolExtra = ({ tool }) => {
    const { handler, component: Node } = tool.getComponent();
    if (!Node || !tool.isEnabled()) {
        return null;
    }
    return (
        <div className="t_options extraOptions">
            <Node state={handler.getState()} controller={handler?.getController()} />
        </div>
    );
};
ToolExtra.propTypes = {
    tool: PropTypes.object.isRequired
};

const ToolCheckbox = ({ tool, controller }) => {
    const { title, hideCheckbox, disabledReason } = tool.getTool();
    if (hideCheckbox) {
        return null;
    }
    if (tool.isDisabled()) {
        return (<Tooltip title={disabledReason}>
            <Checkbox disabled={true} >
                {title}
            </Checkbox>
        </Tooltip>);
    }
    return (
        <Checkbox
            checked={tool.isEnabled()}
            onChange={(e) => controller.setToolEnabled(tool, e.target.checked)}
        >
            {title}
        </Checkbox>);
};
ToolCheckbox.propTypes = {
    tool: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
