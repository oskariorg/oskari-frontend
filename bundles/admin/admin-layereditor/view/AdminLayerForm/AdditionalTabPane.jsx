import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { withLocale } from 'oskari-ui/util';

const AdditionalTabPane = (props) => {
    const { layer, service, getMessage } = props;
    return (
        <StyledTab>
            <label>{getMessage('metaInfoId')}</label>
            <StyledComponent>
                <TextInput placeholder={getMessage('metaInfoIdDesc')}
                    value={layer.metadataIdentifier} onChange={(evt) => service.setMetadataIdentifier(evt.target.value)} />
            </StyledComponent>
            <label>{getMessage('gfiContent')}</label>
            <StyledComponent>
                <TextAreaInput rows={6} value={layer.gfiContent} onChange={(evt) => service.setGfiContent(evt.target.value)} />
            </StyledComponent>
            <label>{getMessage('attributes')}</label>
            <StyledComponent>
                <TextAreaInput rows={6} value={layer.attributes} onChange={(evt) => service.setAttributes(evt.target.value)} />
            </StyledComponent>
        </StyledTab>
    );
};

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    additionalProps: PropTypes.any,
    getMessage: PropTypes.func
};

const contextWrap = withLocale(AdditionalTabPane);
export { contextWrap as AdditionalTabPane };
