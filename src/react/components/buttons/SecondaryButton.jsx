import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';

export const SecondaryButton = ({ type, ...other }) => (
    <Button className={`t_button_${type}`} {...other}>
        <Message bundleKey='oskariui' messageKey={`buttons.${type}`}/>
    </Button>
);

SecondaryButton.propTypes = {
    type: PropTypes.oneOf(['close', 'no', 'cancel']),
};
