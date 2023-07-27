import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { GEOMETRY_TYPES, getGeometryType } from '../../LayerHelper';
import { InfoTooltip } from '../InfoTooltip';

export const VectorLayerAttributes = ({ layer, controller }) => {
    const geometryTypeSource = layer.attributes.data?.geometryType ? 'Attributes' : 'Capabilities';
    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <InfoTooltip messageKeys={`attributes.geometryType.source${geometryTypeSource}`}/>
            <StyledFormField>
                <Select
                    value={getGeometryType(layer)}
                    onChange={value => controller.setAttributesData('geometryType', value)}>
                    { GEOMETRY_TYPES.map(type => (
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
