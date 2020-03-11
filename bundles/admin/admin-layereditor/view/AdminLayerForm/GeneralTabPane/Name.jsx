import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { MandatoryIcon } from '../Mandatory';

export const Name = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='uniqueName' /> <MandatoryIcon isValid={!!layer.name} />
        <StyledFormField>
            <TextInput type='text' value={layer.name} onChange={evt => controller.setLayerName(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
Name.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
