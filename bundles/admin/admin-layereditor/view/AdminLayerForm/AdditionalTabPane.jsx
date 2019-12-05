import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { withLocale } from 'oskari-ui/util';

export const AdditionalTabPane = withLocale(({ layer, service, getMessage, Message }) => (
    <StyledTab>
        <Message messageKey='metainfoId'/>
        <StyledComponent>
            <TextInput
                placeholder={getMessage('metaInfoIdDesc')}
                value={layer.metadataid}
                onChange={(evt) => service.setMetadataIdentifier(evt.target.value)} />
        </StyledComponent>
        <Message messageKey='gfiContent'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={layer.gfiContent}
                onChange={(evt) => service.setGfiContent(evt.target.value)} />
        </StyledComponent>
        <Message messageKey='attributes'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={JSON.stringify(layer.attributes || {}, null, 2)}
                onChange={(evt) => service.setAttributes(evt.target.value)} />
        </StyledComponent>
    </StyledTab>
));

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    additionalProps: PropTypes.any
};
