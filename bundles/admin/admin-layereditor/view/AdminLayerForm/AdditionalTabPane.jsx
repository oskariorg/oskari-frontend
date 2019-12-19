import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput, Message } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer } from 'oskari-ui/util';

export const AdditionalTabPane = LocaleConsumer(({ layer, controller, getMessage }) => (
    <StyledTab>
        <Message messageKey='metainfoId'/>
        <StyledComponent>
            <TextInput
                placeholder={getMessage('metaInfoIdDesc')}
                value={layer.metadataid}
                onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
        </StyledComponent>
        <Message messageKey='gfiContent'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={layer.gfiContent}
                onChange={(evt) => controller.setGfiContent(evt.target.value)} />
        </StyledComponent>
        <Message messageKey='attributes'/>
        <StyledComponent>
            <TextAreaInput
                rows={6}
                value={JSON.stringify(layer.attributes || {}, null, 2)}
                onChange={(evt) => controller.setAttributes(evt.target.value)} />
        </StyledComponent>
    </StyledTab>
));

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    controller: PropTypes.any,
    additionalProps: PropTypes.any
};
