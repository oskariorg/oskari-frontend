import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { StyledSelect } from './styled';

export const SpeedSelect = ({ speedHandler, speed }) => {
    const handleSpeedChange = (val) => {
        speedHandler(val);
    };

    const speedValues = [
        {
            value: 'slow',
            label: <Message messageKey={'speeds.slow'} />
        },
        {
            value: 'normal',
            label: <Message messageKey={'speeds.normal'} />
        },
        {
            value: 'fast',
            label: <Message messageKey={'speeds.fast'} />
        }
    ];
    return (
        <StyledSelect
            defaultValue={speed}
            size='large'
            onChange={handleSpeedChange}
            options={speedValues}/>
    );
};
SpeedSelect.propTypes = {
    speedHandler: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired
};
