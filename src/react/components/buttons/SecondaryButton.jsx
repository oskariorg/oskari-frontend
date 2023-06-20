import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

export const SecondaryButton = ({ type, ...other }) => (
    <StyledButton className={`t_button t_${type}`} {...other}>
        <Message bundleKey='oskariui' messageKey={`buttons.${type}`}/>
    </StyledButton>
);

SecondaryButton.propTypes = {
    type: PropTypes.oneOf(['close', 'no', 'cancel', 'previous', 'delete', 'reset', 'clear']).isRequired
};
