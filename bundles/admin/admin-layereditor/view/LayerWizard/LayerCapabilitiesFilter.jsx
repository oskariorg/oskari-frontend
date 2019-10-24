import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'oskari-ui';

export const LayerCapabilitiesFilter = ({ filter, onChange = () => {} }) => {
    return (<TextInput value={filter || ''} onChange={(event) => onChange(event.target.value)} />);
};

LayerCapabilitiesFilter.propTypes = {
    filter: PropTypes.string,
    onChange: PropTypes.func
};
