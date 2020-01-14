import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledComponent } from '../StyledFormComponents';

export const LegendImage = LocaleConsumer(({ layer, controller, getMessage }) => (
    <Fragment>
        <Message messageKey='legendImage'/>
        <InfoTooltip messageKeys='legendImageDesc'/>
        <StyledComponent>
            <TextInput
                placeholder={getMessage('legendImagePlaceholder')}
                value={layer.legendImage}
                onChange={(evt) => controller.setLegendImage(evt.target.value)} />
        </StyledComponent>
    </Fragment>
));
LegendImage.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
