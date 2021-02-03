import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { InfoTooltip } from '../InfoTooltip';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { StyledFormField } from './styled';

export const LegendImage = LocaleConsumer(({ legendImage = '', controller, getMessage }) => (
    <Fragment>
        <Message messageKey='styles.raster.legendImage'/>
        <InfoTooltip messageKeys='styles.raster.legendImageDesc'/>
        <StyledFormField>
            <TextInput
                placeholder={getMessage('styles.raster.legendImagePlaceholder')}
                value={legendImage}
                onChange={(evt) => controller.setLegendImage(evt.target.value)} />
        </StyledFormField>
    </Fragment>
));

LegendImage.propTypes = {
    legendImage: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};
