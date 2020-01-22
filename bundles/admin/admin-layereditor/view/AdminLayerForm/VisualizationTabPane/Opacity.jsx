import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Opacity as CommonOpacity } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const Opacity = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='opacity'/>
        <StyledComponent>
            <CommonOpacity
                key={layer.id}
                defaultValue={layer.opacity}
                onChange={value => controller.setOpacity(value)} />
        </StyledComponent>
    </Fragment>
);
Opacity.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
