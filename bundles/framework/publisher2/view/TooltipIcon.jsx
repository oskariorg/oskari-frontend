import React from 'react';
import { PropTypes } from 'prop-types';

export const TooltipIcon = ({ tooltip }) => {
    return <div className='help icon-info' title={tooltip} />;
};

TooltipIcon.propTypes = {
    tooltip: PropTypes.string
};
