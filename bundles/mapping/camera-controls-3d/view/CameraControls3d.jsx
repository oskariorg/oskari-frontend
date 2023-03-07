import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';

export const CameraControls3d = ({ mapInMobileMode, activeMapMoveMethod, location, controller }) => {
    const CameraControlsComponent = mapInMobileMode ? Mobile : Desktop;
    return <CameraControlsComponent activeMapMoveMethod={activeMapMoveMethod} controller={controller} location={location} />;
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
