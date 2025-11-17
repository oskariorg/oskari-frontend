import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoIcon } from 'oskari-ui/components/icons';
import { StyledFormField } from '../styled';

export const GfiType = ({ layer, controller }) => {
    const { capabilities = {}, gfiType } = layer;
    const options = capabilities.infoFormats || [];
    const value = gfiType || '';
    if (options.length === 0) {
        return null;
    }
    return (
        <Fragment>
            <Message messageKey='fields.gfiType'/>
            <InfoIcon  title={<Message messageKey='gfiTypeDesc'/>} />
            <StyledFormField>
                <Select
                    value={value}
                    onChange={value => controller.setGfiType(value)}
                    options={ options.map(option => ({
                        'value': option, 'data-value': option, 'label': option
                    })) }
                />
            </StyledFormField>
        </Fragment>
    );
};
GfiType.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
