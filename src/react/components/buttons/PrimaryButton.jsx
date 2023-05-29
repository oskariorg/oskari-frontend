import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

export const PrimaryButton = ({ type, ...other }) => (
    <StyledButton type='primary' className={`t_button t_${type}`} {...other}>
        <Message bundleKey='oskariui' messageKey={`buttons.${type}`}/>
    </StyledButton>
);

PrimaryButton.propTypes = {
    type: PropTypes.oneOf(['add', 'close', 'delete', 'edit', 'save', 'yes', 'submit', 'import', 'next', 'print', 'search', 'copy']).isRequired
};
