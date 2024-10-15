import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker as AntColorPicker  } from 'antd';
import { Tooltip, Message } from 'oskari-ui'

export const ColorPicker = ({ value = '#FFFFFF', disabled, hideTextInput, onChange }) => {
    const presets = [{
        label: null,
        colors: Oskari.custom.getColors(),
        defaultOpen: true
    }];
    return (
        <Tooltip title={disabled ? '' : <Message messageKey={`ColorPicker.tooltip`} bundleKey='oskariui'/>}>
            <AntColorPicker
                presets={presets}
                showText={!hideTextInput && !disabled && !!value}
                disabledAlpha
                disabled={disabled}
                value={value}
                onChange={color => onChange(color.toHexString())}/>
        </Tooltip>
    );
};

ColorPicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    hideTextInput: PropTypes.bool
};
