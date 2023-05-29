import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Button, TextAreaInput, Collapse, CollapsePanel, Link } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';
import { StyledFormField, SpacedLabel } from '../styled';

const UpdateNowButton = ({ controller }) => (
    <Button onClick={() => controller.updateCapabilities()}>
        <Message messageKey='capabilities.update' />
    </Button>
);
UpdateNowButton.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired
};

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

export const Capabilities = ({ layer, controller }) => {
    const { id } = layer;
    return (
        <Fragment>
            <Numeric
                value={layer.capabilitiesUpdateRate}
                messageKey='capabilities.updateRate'
                infoKeys='capabilities.updateRateDesc'
                suffix='s'
                allowNegative={false}
                allowZero={false}
                onChange={value => controller.setCapabilitiesUpdateRate(value)}>
                { id &&
                    <Fragment>
                        <UpdateNowButton controller={controller} />
                        <SpacedLabel/>
                        <Link tooltip={null} url={Oskari.urls.getRoute('GetLayerCapabilities', { id })}>
                            <Message messageKey='capabilities.show' />
                        </Link>
                    </Fragment>
                }
            </Numeric>
            <ParsedCapabilities capabilities = {layer.capabilities} />
        </Fragment>
    );
};
Capabilities.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
