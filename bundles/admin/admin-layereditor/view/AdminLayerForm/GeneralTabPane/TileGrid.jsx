import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../VisualizationTabPane/styled';
import { JsonInput } from '../JsonInput';
import { InfoTooltip } from '../InfoTooltip';

const template =
`
{
    "origin": [-548576, 8388608],
    "resolutions": [8192, ..., 0.25],
    "tileSize": [256, 256]
}
`;
export const TileGrid = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='tileGrid'/>
        <InfoTooltip message={<pre>{template}</pre>} />
        <StyledFormField>
            <JsonInput
                rows={6}
                value={layer.tempTileGridJSON}
                onChange={evt => controller.setTileGridJSON(evt.target.value)} />
        </StyledFormField>
    </Fragment>
);
TileGrid.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
