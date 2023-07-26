import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';

export const VectorLayerAttributes = ({ layer, controller }) => {
    const { attributes, capabilities } = layer;
    return (
        <Fragment>
            <Message messageKey='attributes.geometryType.label'/>
            <StyledFormField>
                <Select
                    onChange={evt => controller.setAttributes(evt.target.value)} />
            </StyledFormField>
        </Fragment>
    );
};

VectorLayerAttributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
