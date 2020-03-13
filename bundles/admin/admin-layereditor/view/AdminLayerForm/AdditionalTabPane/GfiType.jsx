import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { InlineFlex } from '../InlineFlex';
import { InfoTooltip } from '../InfoTooltip';

export const GfiType = ({ layer }) => {
    if (!layer.gfiType) {
        return null;
    }
    return (
        <InlineFlex>
            <div>
                <Message messageKey='fields.gfiType'/>
                <InfoTooltip messageKeys='gfiTypeDesc'/>
            </div>
            <div>{ layer.gfiType }</div>
        </InlineFlex>
    );
};
GfiType.propTypes = {
    layer: PropTypes.object.isRequired
};
