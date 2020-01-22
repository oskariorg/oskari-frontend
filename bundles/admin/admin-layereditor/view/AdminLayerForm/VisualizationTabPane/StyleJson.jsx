import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { JsonInput } from '../JsonInput';
import { InfoTooltip } from '../InfoTooltip';

const template = '{\n  "My style 1": {\n    "featureStyle": {...},\n    "optionalStyles": [{...}]\n  },\n  ...\n}';

export const StyleJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='stylesJSON'/>
        <InfoTooltip message={<pre>{template}</pre>} />
        <StyledComponent>
            <JsonInput
                rows={6}
                value={layer.tempStylesJSON}
                onChange={evt => controller.setStyleJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
StyleJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
