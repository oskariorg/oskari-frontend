import React from 'react';
import { PropTypes } from 'prop-types';
import { PrimaryButton } from './';
import { Message } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';

const copy = (value) => {
    navigator.clipboard.writeText(value);
    Messaging.success(<Message bundleKey='oskariui' messageKey='messages.copied' />);
};

export const CopyButton = ({ value, onClick, disabled = false, ...other }) => {

    return (
        <PrimaryButton
            type='copy'
            disabled={disabled}
            onClick={() => {
                if (typeof onClick === 'function') {
                    onClick();
                }
                copy(value);
            }}
            {...other}
        />
    );
};

CopyButton.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};
