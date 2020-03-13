
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { OptionInput } from './OptionInput';
import { StyledFormField } from '../styled';

export const ApiKey = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='fields.options.apiKey' /> (<Message messageKey={`layertype.${layer.type}`} defaultMsg={layer.type} />)
        <StyledFormField>
            <OptionInput layer={layer} controller={controller} propKey='apiKey'/>
        </StyledFormField>
    </Fragment>
);
ApiKey.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    defaultOpen: PropTypes.bool
};
