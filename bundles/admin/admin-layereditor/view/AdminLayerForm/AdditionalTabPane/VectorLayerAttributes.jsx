import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Button, Badge } from 'oskari-ui';
import { Modal } from 'oskari-ui/components/Modal';
import { FeatureFilter, cleanFilter } from 'oskari-ui/components/FeatureFilter';
import { VectorLayerPresentation } from 'oskari-ui/components/VectorLayerPresentation';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Controller, Messaging } from 'oskari-ui/util';
import { PropertiesFilter, PropertiesLocale, PropertiesFormat } from './VectorLayerAttributes/';
import { StyledFormField, Border } from '../styled';
import { GEOMETRY_TYPES, DATA, getGeometryType } from '../../LayerHelper';
const Buttons = styled.div`
    display: inline-flex;
    > * {
        margin-right: 20px;
    }
`;

// Clean empty objects and values that doesn't need to store
// data.format: false options
// data.locale: empty strings
const clean = obj => {
    for (const key in obj) {
        const val = obj[key];
        if(typeof val === 'object' && !Array.isArray(val) && val !== null) {
            if (!Object.keys(val).length) {
                delete obj[key];
            } else {
                clean(val);
            }
        } else if (typeof val === 'string' && !val.trim().length) {
            delete obj[key];
        } else if (val === null || val === false) {
            delete obj[key];
        }
    }
};

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

            <VectorLayerPresentation layer={layer} updateAttributes={updateAttributes} updateFeatureFilter={updateFeatureFilter} />
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
