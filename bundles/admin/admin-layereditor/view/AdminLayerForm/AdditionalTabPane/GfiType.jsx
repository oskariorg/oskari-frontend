import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField } from '../styled';

export const GfiType = ({ layer, controller }) => {
    const { capabilities, gfiType } = layer;
    const { formats = {} } = capabilities;
    const options = formats.available || [];
    const value = gfiType || formats.value || '';
    if (options.length === 0) {
        return null;
    }
    return (
        <Fragment>
            <Message messageKey='fields.gfiType'/>
            <InfoTooltip messageKeys='gfiTypeDesc'/>
            <StyledFormField>
                <Select
                    defaultValue={value}
                    onChange={value => controller.setGfiType(value)}
                >
                    { options.map(option => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                    )) }
                </Select>
            </StyledFormField>
        </Fragment>
    );
};
GfiType.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
