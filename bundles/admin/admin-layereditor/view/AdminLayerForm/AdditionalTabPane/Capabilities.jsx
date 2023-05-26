import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput, Collapse, CollapsePanel, Link } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';
import { StyledFormField, SpacedLabel } from '../styled';
import styled from 'styled-components';

const StyledNumeric = styled(Numeric)`
    min-width: 120px;
`;

const parsedTextArea = {
    minRows: 4,
    maxRows: 12
};
const ParsedCapabilities = ({ capabilities = {} }) => {
    const prettier = JSON.stringify(capabilities, null, 4);
    return (
        <StyledFormField>
            <Collapse>
                <CollapsePanel header={<Message messageKey='capabilities.parsed'/>}>
                    <TextAreaInput value={prettier} autoSize={parsedTextArea} />
                </CollapsePanel>
            </Collapse>
        </StyledFormField>
    );
};
ParsedCapabilities.propTypes = {
    capabilities: PropTypes.object.isRequired
};

export const Capabilities = ({ layer, metadata, controller }) => {
    const { id } = layer;
    return (
        <Fragment>
            <StyledNumeric
                value={layer.capabilitiesUpdateRate / 60}
                messageKey='capabilities.updateRate'
                infoKeys={metadata?.capabilitiesCron ? ['capabilities.updateRateDesc', ['capabilities.updateRateCronMsg', {"cron": metadata.capabilitiesCron}]] : 'capabilities.updateRateDesc'}
                suffix='min'
                allowNegative={false}
                allowZero={false}
                onChange={value => controller.setCapabilitiesUpdateRate(value * 60)}>
                { id &&
                    <Fragment>
                        <SpacedLabel/>
                        <Link tooltip={null} url={Oskari.urls.getRoute('GetLayerCapabilities', { id })}>
                            <Message messageKey='capabilities.show' />
                        </Link>
                    </Fragment>
                }
            </StyledNumeric>
            <ParsedCapabilities capabilities = {layer.capabilities} />
        </Fragment>
    );
};
Capabilities.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
