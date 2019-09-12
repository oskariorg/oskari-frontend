import React from 'react';
import PropTypes from 'prop-types';
import {TextInput} from '../../components/TextInput';
import {TextAreaInput} from '../../components/TextAreaInput';
import {StyledTab, StyledComponent} from './AdminLayerFormStyledComponents';
import {withContext} from '../../../../../src/react/util.jsx';

const AdditionalTabPane = (props) => {
    const {layer, service, loc} = props;
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

const contextWrap = withContext(AdditionalTabPane);
export {contextWrap as AdditionalTabPane};
