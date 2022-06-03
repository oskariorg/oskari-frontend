import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'oskari-ui';
import { ButtonContainer } from 'oskari-ui/components/buttons';

const Tool = ({ tool }) => {
    const Component = tool.getComponent();
    const name = tool.getName();
    const onClick = tool.getCallback();
    return (
        <Tooltip title={tool.getTooltip()}>
            <Button type='primary' onClick={() => onClick()} className={`t_${name}`} >
                <Component/>
            </Button>
        </Tooltip>);
};
Tool.propTypes = {
    tool: PropTypes.any.isRequired
};

export const FlyoutFooter = ({
    tools
}) => {
    if (!tools.length) {
        return null;
    }
    return (
        <Fragment>
            <ButtonContainer>
                {tools.map(tool => <Tool key={tool.getName()} tool={tool}/>) }
            </ButtonContainer>
        </Fragment>
    );
};
FlyoutFooter.propTypes = {
    tools: PropTypes.array.isRequired
};
