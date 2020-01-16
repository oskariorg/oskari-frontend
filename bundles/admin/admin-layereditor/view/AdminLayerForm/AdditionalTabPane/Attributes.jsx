import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const Attributes = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='attributes'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={layer.attributes}
                onChange={evt => controller.setAttributes(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
Attributes.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
