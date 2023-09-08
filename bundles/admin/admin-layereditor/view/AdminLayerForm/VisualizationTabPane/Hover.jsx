import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';
import { JsonInput } from '../JsonInput';
import { InfoIcon } from 'oskari-ui/components/icons';

const template =
`{
    "featureStyle": {...},
    "content": [
        {"key": "Feature Data"},
        {"key": "ID", "valueProperty": "id"}
    ]
}`;

export const Hover = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='hover'/>
        <InfoIcon>
            <pre>{template}</pre>
        </InfoIcon>
        <StyledFormField>
            <JsonInput
                rows={6}
                value={layer.tempHoverJSON}
                onChange={evt => controller.setHoverJSON(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
Hover.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
