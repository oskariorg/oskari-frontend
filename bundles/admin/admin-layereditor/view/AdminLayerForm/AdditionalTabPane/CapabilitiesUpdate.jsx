import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';
import styled from 'styled-components';

const UpdateNowButton = ({ controller }) => (
    <Button onClick={() => controller.updateCapabilities()}>
        <Message messageKey='capabilities.update' />
    </Button>
);
UpdateNowButton.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired
};

const Link = styled('a')`
    margin-left: 10px;
`;
const ShowCapabilities = ({ layerId }) => {
    const url = Oskari.urls.getRoute('GetLayerCapabilities', { id: layerId });
    return (
        <Link href={url} target='capabilities'>
            <Message messageKey='capabilities.show' />
        </Link>
    );
};
ShowCapabilities.propTypes = {
    layerId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
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
            { layer.id &&
                <Fragment>
                    <UpdateNowButton controller={controller} />
                    <ShowCapabilities layerId={layer.id} />
                </Fragment>
            }
        </Numeric>
    </Fragment>
);
CapabilitiesUpdate.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
