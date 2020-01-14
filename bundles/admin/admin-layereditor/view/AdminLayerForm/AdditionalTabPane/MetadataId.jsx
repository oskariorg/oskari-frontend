import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { InfoTooltip } from '../InfoTooltip';

export const MetadataId = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='metadataId'/>
        <InfoTooltip messageKeys='metadataIdDesc'/>
        <StyledComponent>
            <TextInput
                value={layer.metadataid}
                onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
MetadataId.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
