import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../components/TextInput';
import { TextAreaInput } from '../components/TextAreaInput';
import { StyledTab, StyledComponent } from './AdminLayerFormStyledComponents';

export const AdditionalTabPane = ({layer, service}) => {
    return (
        <StyledTab>
            <label>Metadata file identifier</label>
            <StyledComponent>
                <TextInput placeholder='The metadata file identifier is an XML file identifier.'
                    value={layer.metadataIdentifier} onChange={(evt) => service.setMetadataIdentifier(evt.target.value)} />
            </StyledComponent>
            <label>Additional GFI info</label>
            <StyledComponent>
                <TextAreaInput value={layer.gfiContent} onChange={(evt) => service.setGfiContent(evt.target.value)} />
            </StyledComponent>
            <label>Attributes</label>
            <StyledComponent>
                <TextAreaInput value={layer.attributes} onChange={(evt) => service.setAttributes(evt.target.value)} />
            </StyledComponent>
        </StyledTab>
    );
};

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    additionalProps: PropTypes.any
};
