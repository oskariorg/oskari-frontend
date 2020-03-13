import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';

export const GfiContent = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='fields.gfiContent'/>
        <StyledFormField>
            <TextAreaInput
                rows={4}
                value={layer.gfiContent}
                onChange={(evt) => controller.setGfiContent(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
GfiContent.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
