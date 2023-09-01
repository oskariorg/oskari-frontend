import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { JsonInput } from '../JsonInput';

const AttributeInfo = ({ attributes }) => {
    if (!attributes) {
        return null;
    }
    return (
        <InfoIcon>
            <div>
                <pre>{JSON.stringify(attributes, null, 2)}</pre>
            </div>;
        </InfoIcon>
    );
};
AttributeInfo.propTypes = {
    attributes: PropTypes.object
};
export const Attributes = ({ layer, controller }) => {
    const { tempAttributesJSON } = layer;
    let isValid = true;
    if (tempAttributesJSON) {
        try {
            isValid = typeof JSON.parse(tempAttributesJSON) === 'object';
        } catch (err) {
            isValid = false;
        }
    }
    return (
        <Fragment>
            <Message messageKey='attributes.label'/>
            { !isValid && <AttributeInfo attributes={layer.attributes} /> }
            <StyledFormField>
                <JsonInput
                    isValid={isValid}
                    rows={6}
                    value={layer.tempAttributesJSON}
                    onChange={evt => controller.setAttributes(evt.target.value)} />
            </StyledFormField>
        </Fragment>
    );
};
Attributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
