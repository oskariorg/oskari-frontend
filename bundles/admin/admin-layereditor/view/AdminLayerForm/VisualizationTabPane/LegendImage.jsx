import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { InfoTooltip } from '../InfoTooltip';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';

export const GLOBAL_LEGEND = 'legendImage';

export const LegendImage = LocaleConsumer(({ url = '', controller, getMessage }) => (
    <Fragment>
        <Message messageKey='styles.raster.legendImage'/>
        <InfoTooltip messageKeys='styles.raster.legendImageDesc'/>
        <StyledFormField>
            <TextInput
                placeholder={getMessage('styles.raster.legendImagePlaceholder')}
                value={url}
                onChange={(evt) => controller.setLegendUrl(GLOBAL_LEGEND, evt.target.value)} />
        </StyledFormField>
    </Fragment>
));

LegendImage.propTypes = {
    url: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};
