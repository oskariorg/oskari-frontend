import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';

export const TYPES = ['unknown', 'point', 'line', 'area', 'collection'];

const fromCapa = capa => {
    const { geomName, featureProperties = []} = capa;
    const { type } = featureProperties.find(prop => prop.name === geomName) || {};
    // TODO: map capa type to types
    return TYPES.includes(type) ? type : null;
};

export const VectorLayerAttributes = ({ layer, controller }) => {
    const { attributes , capabilities } = layer;
    const { data = {} } = attributes;
    const geometryType = data.geometryType || fromCapa(capabilities) || 'unknown';
    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <StyledFormField>
                <Select
                    value={geometryType}
                    onChange={value => controller.setAttributesData('geometryType', value)}>
                    { TYPES.map(type => (
                        <Option key={type} value={type}>
                            <Message messageKey={`attributes.geometryType.${type}`} />
                        </Option>
                    )) }
                </Select>
            </StyledFormField>
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
