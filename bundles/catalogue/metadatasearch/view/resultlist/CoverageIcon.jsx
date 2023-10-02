import React from 'react';
import { PropTypes } from 'prop-types';

export const CoverageIcon = (props) => {
    const { active, item, toggleCoverageArea } = props;
    return <div className={active ? 'icon-info-area-active' : 'icon-info-area'} onClick={() => toggleCoverageArea(item)}/>;
};

CoverageIcon.propTypes = {
    active: PropTypes.bool,
    item: PropTypes.object,
    toggleCoverageArea: PropTypes.func
};
