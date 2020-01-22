import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { JsonInput } from '../JsonInput';
import { InfoTooltip } from '../InfoTooltip';

const template = '{\n  "My external json style": { ... },\n  ...\n}';

export const ExternalStyleJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='externalStylesJSON'/>
        <InfoTooltip message={
            <pre>
                <Message messageKey='externalStyleFormats'/>
                {template}
            </pre>
        } />
        <StyledComponent>
            <JsonInput
                rows={6}
                value={layer.tempExtStyleJSON}
                onChange={evt => controller.setExternalStyleJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
ExternalStyleJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
