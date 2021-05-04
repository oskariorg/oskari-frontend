import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField, Border } from '../styled';
import { InfoTooltip } from '../InfoTooltip';
import { ServiceMetadata } from './ServiceMetadata';
import { MetadataButton } from './styled';

export const MetadataId = ({ layer, controller }) => {
    const hasHandler = Oskari.getSandbox().hasHandler('catalogue.ShowMetadataRequest');
    const renderButton = layer.metadataid && hasHandler;
    return (
        <Fragment>
            <Message messageKey='metadata.title'/>
            <InfoTooltip messageKeys='metadata.desc'/>
            <Border>
                <StyledFormField>
                    <ServiceMetadata capabilities={layer.capabilities} controller={controller} hasHandler={hasHandler} />
                </StyledFormField>
                <StyledFormField>
                    <Message messageKey='metadata.overridden'/>
                    {renderButton &&
                        <MetadataButton onClick={() => controller.showLayerMetadata(layer.metadataid)}/>
                    }
                    <TextInput
                        value={layer.metadataid}
                        onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
                </StyledFormField>
            </Border>
        </Fragment>
    );
};
MetadataId.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
