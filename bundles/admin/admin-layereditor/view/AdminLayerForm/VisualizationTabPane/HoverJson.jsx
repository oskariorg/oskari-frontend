import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const HoverJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='hoverJSON'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={layer.hoverJSON}
                onChange={evt => controller.setHoverJSON(evt.target.value)}/>
        </StyledComponent>
    </Fragment>
);
HoverJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
