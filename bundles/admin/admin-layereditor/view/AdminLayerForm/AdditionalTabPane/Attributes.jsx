import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { InfoTooltip } from '../InfoTooltip';
import { JsonInput } from '../JsonInput';

const AttributeInfo = ({ attributes }) => {
    if (!attributes) {
        return null;
    }
    const info =
        <div>
            <pre>{attributes}</pre>
        </div>;
    return <InfoTooltip message={info} />;
};
AttributeInfo.propTypes = {
    attributes: PropTypes.string
};
export const Attributes = ({ layer, controller }) => {
    const { tempAttributesStr } = layer;
    let isValid = true;
    if (tempAttributesStr) {
        try {
            isValid = typeof JSON.parse(tempAttributesStr) === 'object';
        } catch (err) {
            isValid = false;
        }
    }
    return (
        <Fragment>
            <Message messageKey='attributes'/>
            { !isValid && <AttributeInfo attributes={layer.attributes} /> }
            <StyledComponent>
                <JsonInput
                    isValid={isValid}
                    rows={6}
                    value={layer.tempAttributesStr}
                    onChange={evt => controller.setAttributes(evt.target.value)} />
            </StyledComponent>
        </Fragment>
    );
};
Attributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
