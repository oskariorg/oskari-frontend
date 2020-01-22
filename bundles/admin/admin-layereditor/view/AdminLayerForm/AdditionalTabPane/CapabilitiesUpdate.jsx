import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';
import styled from 'styled-components';

const Link = styled('a')`
    margin-left: 10px;
`;
const getCapabilitiesUrl = ({ url, type, version, password, username }) => {
    return Oskari.urls.getRoute('GetWSCapabilities', {
        url,
        type,
        version,
        pw: password,
        user: username
    });
};

export const CapabilitiesUpdate = ({ layer, controller }) => (
    <Fragment>
        <Numeric
            value={layer.capabilitiesUpdateRate}
            messageKey='capabilities.updateRate'
            infoKeys='capabilities.updateRateDesc'
            suffix='s'
            allowNegative={false}
            allowZero={false}
            onChange={value => controller.setCapabilitiesUpdateRate(value)}>
            <Fragment>
                <Button value={layer.name} onClick={() => controller.updateCapabilities()}>
                    <Message messageKey='capabilities.update' />
                </Button>
                <Link href={getCapabilitiesUrl(layer)} target='capabilities'>
                    <Message messageKey='capabilities.show' />
                </Link>
            </Fragment>
        </Numeric>
    </Fragment>
);
CapabilitiesUpdate.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
