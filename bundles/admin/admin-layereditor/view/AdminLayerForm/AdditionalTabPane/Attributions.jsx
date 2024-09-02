import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../VisualizationTabPane/styled';
import { JsonInput } from '../JsonInput';
import { InfoIcon } from 'oskari-ui/components/icons';

const template =
`[
    {
        "label": "© MyOrganization",
        "link": "https://linktomycopyrights"
    },
    ...
]`;
export const Attributions = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='attributions'/>
        <InfoIcon>
            <pre>{template}</pre>
        </InfoIcon>
        <StyledFormField>
            <JsonInput
                rows={6}
                value={layer.tempAttributionsJSON}
                onChange={evt => controller.setAttributionsJSON(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
Attributions.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
