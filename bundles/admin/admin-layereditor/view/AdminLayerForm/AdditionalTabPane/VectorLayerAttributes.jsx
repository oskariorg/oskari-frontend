import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select } from 'oskari-ui';
import { VectorLayerPresentation } from 'oskari-ui/components/VectorLayerPresentation';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { GEOMETRY_TYPES, DATA, getGeometryType } from '../../LayerHelper';

export const VectorLayerAttributes = ({ layer, controller }) => {
    const { data = {} } = layer.attributes;

    const onGeometryTypeChange = value => {
        const key = DATA.GEOMETRY;
        if (GEOMETRY_TYPES[0] === value) {
            controller.setAttributesData(key);
        } else {
            controller.setAttributesData(key, value);
        }
    };

    const updateAttributes = (modal, value) => {
        controller.setAttributesData(modal,value);
    };

    const updateFeatureFilter = (value) => {
        controller.setFeatureFilter(value);
    };

    const geometryTypeSource = data[DATA.GEOMETRY] ? 'Attributes' : 'Capabilities';
    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <InfoIcon title={<Message messageKey={`attributes.geometryType.source${geometryTypeSource}`}/>}/>
            <StyledFormField>
                <Select
                    value={getGeometryType(layer)}
                    onChange={onGeometryTypeChange}
                    options={ GEOMETRY_TYPES.map(type => ({
                        value: type,
                        label: <Message messageKey={`attributes.geometryType.${type}`} />
                    }))}
                />
            </StyledFormField>

            <VectorLayerPresentation layer={layer} updateAttributes={updateAttributes} updateFeatureFilter={updateFeatureFilter} allowReplaceId={true} />
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
