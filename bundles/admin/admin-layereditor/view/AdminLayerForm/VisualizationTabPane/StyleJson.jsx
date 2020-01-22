import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { JsonInput } from '../JsonInput';

export const StyleJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='styleJSON'/>
        <StyledComponent>
            <JsonInput
                rows={6}
                value={layer.tempStyleJSON}
                onChange={evt => controller.setStyleJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
StyleJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
