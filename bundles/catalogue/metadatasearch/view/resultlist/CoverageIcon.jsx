import React from 'react';
import { PropTypes } from 'prop-types';

export const CoverageIcon = (props) => {
    const { active } = props;
    return <div className={active ? 'icon-info-area-active' : 'icon-info-area'}/>;
};

CoverageIcon.propTypes = {
    active: PropTypes.bool
};
