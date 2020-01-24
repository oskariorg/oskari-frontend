import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

const onChange = (evt, layer, propKey, update) => {
    const options = { ...layer.options };
    if (!evt.target.value) {
        delete options[propKey];
    } else {
        options[propKey] = evt.target.value;
    }
    update(options);
};

export const OptionInput = ({ layer, controller, propKey }) => {
    const update = value => controller.setOptions(value);
    return (
        <TextInput
            type='text'
            value={layer.options[propKey]}
            onChange={evt => onChange(evt, layer, propKey, update)} />
    );
};
OptionInput.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    propKey: PropTypes.string.isRequired
};
