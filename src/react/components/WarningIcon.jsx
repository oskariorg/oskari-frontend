import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'oskari-ui';
import { WarningTwoTone } from '@ant-design/icons';

const color = '#FFBF00';

export const WarningIcon = (props) => {
    return (
        props.tooltip
            ? <Tooltip title={props.tooltip}>
                <WarningTwoTone twoToneColor={color} {...props}/>
            </Tooltip>
            : <WarningTwoTone twoToneColor={color} {...props}/>
    );
};

WarningIcon.propTypes = {
    tooltip: PropTypes.string
};
