import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const StyleJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='styleJSON'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={layer.styleJSON}
                onChange={evt => controller.setStyleJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
StyleJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
