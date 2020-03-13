import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { InfoTooltip } from '../InfoTooltip';

export const MetadataId = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='fields.metadataId'/>
        <InfoTooltip messageKeys='metadataIdDesc'/>
        <StyledFormField>
            <TextInput
                value={layer.metadataid}
                onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
MetadataId.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
