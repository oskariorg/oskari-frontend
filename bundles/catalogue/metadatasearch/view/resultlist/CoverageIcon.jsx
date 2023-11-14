import React from 'react';
import { PropTypes } from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';

export const CoverageIcon = (props) => {
    const { active, item, toggleCoverageArea } = props;
    return <div className={active ? 'icon-info-area-active' : 'icon-info-area'}
        onClick={() => toggleCoverageArea(item)}
        title={active
            ? Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'grid.removeBBOX')
            : Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'grid.showBBOX') }
    />;
};

CoverageIcon.propTypes = {
    active: PropTypes.bool,
    item: PropTypes.object,
    toggleCoverageArea: PropTypes.func
};
