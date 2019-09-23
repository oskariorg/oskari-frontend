import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput } from 'oskari-ui';
import { StyledTab, StyledComponent } from './AdminLayerFormStyledComponents';
import { withLocale } from 'oskari-ui/util';

const AdditionalTabPane = (props) => {
    const { layer, service, loc } = props;
    return (
        <StyledTab>
            <label>{loc('metaInfoId')}</label>
            <StyledComponent>
                <TextInput placeholder={loc('metaInfoIdDesc')}
                    value={layer.metadataIdentifier} onChange={(evt) => service.setMetadataIdentifier(evt.target.value)} />
            </StyledComponent>
            <label>{loc('gfiContent')}</label>
            <StyledComponent>
                <TextAreaInput rows={6} value={layer.gfiContent} onChange={(evt) => service.setGfiContent(evt.target.value)} />
            </StyledComponent>
            <label>{loc('attributes')}</label>
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
    loc: PropTypes.func
};

const contextWrap = withLocale(AdditionalTabPane);
export { contextWrap as AdditionalTabPane };
