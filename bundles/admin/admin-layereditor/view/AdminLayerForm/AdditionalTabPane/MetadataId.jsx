import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const MetadataId = LocaleConsumer(({ layer, controller, getMessage }) => (
    <Fragment>
        <Message messageKey='metadataId'/>
        <StyledComponent>
            <TextInput
                placeholder={getMessage('metadataIdIdDesc')}
                value={layer.metadataid}
                onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
        </StyledComponent>
    </Fragment>
));
MetadataId.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
