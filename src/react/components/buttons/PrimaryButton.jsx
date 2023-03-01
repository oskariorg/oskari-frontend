import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';

export const PrimaryButton = ({ type, ...other }) => (
    <Button type='primary' className={`t_button t_${type}`} {...other}>
        <Message bundleKey='oskariui' messageKey={`buttons.${type}`}/>
    </Button>
);

PrimaryButton.propTypes = {
    type: PropTypes.oneOf(['add', 'close', 'delete', 'edit', 'save', 'yes', 'submit', 'import', 'next', 'print', 'search']).isRequired
};
