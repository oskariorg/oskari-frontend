import React from 'react';
import PropTypes from 'prop-types';
import { Mutator, withMutator, withLocale } from 'oskari-ui/util';
import { CameraControls3dDesktop } from './CameraControls3d/CameraControls3dDesktop';
import { CameraControls3dMobile } from './CameraControls3d/CameraControls3dMobile';

const CameraControls3d = ({ mapInMobileMode, activeMapMoveMethod, mutator, getMessage }) => {
    if (mapInMobileMode) {
        return (<CameraControls3dMobile activeMapMoveMethod={activeMapMoveMethod}
            mutator={mutator}/>);
    }
    return (<CameraControls3dDesktop activeMapMoveMethod={activeMapMoveMethod}
        mutator={mutator} getMessage={getMessage} />);
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    activeMapMoveMethod: PropTypes.string.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withMutator(withLocale(CameraControls3d));
export { contextWrap as CameraControls3d };
