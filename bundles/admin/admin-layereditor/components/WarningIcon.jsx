import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'oskari-ui';

const type = 'warning';
const theme = 'twoTone';
const color = '#FFBF00';

export const WarningIcon = (props) => {
    return (
        props.tooltip
            ? <Tooltip title={props.tooltip}>
                <Icon type={type} theme={theme} twoToneColor={color} {...props}/>
            </Tooltip>
            : <Icon type={type} theme={theme} twoToneColor={color} {...props}/>
    );
};

WarningIcon.propTypes = {
    tooltip: PropTypes.string
};
