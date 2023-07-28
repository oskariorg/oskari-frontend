import React from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { StyledFormField } from '../styled';

const Property = ({ name }) => {
    return (
        <span>{name}</span>
    )
};

export const PropertiesFormatter = ({ formatter, update, properties }) => {
    if (properties) {
        return (<span>test</span>);
    }
    return (
        <div>
            { properties.map(prop => <Property key={prop.name} {...prop}/>) }
        </div>
    );
};

PropertiesFormatter.propTypes = {
    formatter: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
};
