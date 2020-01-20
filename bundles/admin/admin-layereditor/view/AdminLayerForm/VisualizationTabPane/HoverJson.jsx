import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { JsonInput } from '../JsonInput';

export const HoverJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='hoverJSON'/>
        <StyledComponent>
            <JsonInput
                rows={6}
                value={layer.tempHoverJSON}
                onChange={evt => controller.setHoverJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
HoverJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
