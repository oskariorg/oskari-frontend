import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withLocale } from 'oskari-ui/util';
import { Icon } from 'oskari-ui';

const upDownChangePercent = 10;
const iconSize = '24px';
const mobileIconSize = '32px';
const iconShadow = '1px 1px 2px rgba(0,0,0,0.6)';
const darkBgColor = 'rgba(20,20,20,0.8)';

const UpSvg = ({ isMobile }) => (
    <svg width={isMobile ? mobileIconSize : iconSize} height={isMobile ? mobileIconSize : iconSize} viewBox="0 0 24 24">
        <g id="3D-upward" stroke="none" strokeWidth="1" fillRule="nonzero">
            <path d="M12,3.93933983 L15.5303301,7.46966991 C15.8232233,7.76256313 15.8232233,8.23743687 15.5303301,8.53033009 C15.2640635,8.79659665 14.8473998,8.8208027 14.5537883,8.60294824 L14.4696699,8.53033009 L12.75,6.81033983 L12.75,13.25 L11.25,13.25 L11.25,6.81033983 L9.53033009,8.53033009 C9.26406352,8.79659665 8.84739984,8.8208027 8.55378835,8.60294824 L8.46966991,8.53033009 C8.20340335,8.26406352 8.1791973,7.84739984 8.39705176,7.55378835 L8.46966991,7.46966991 L12,3.93933983 Z" id="Combined-Shape" fill={'#ffffff'} fillRule="nonzero"></path>
            <path d="M5.62209673,18.1021658 C9.74978057,15.6943503 13.9299778,15.6341549 18.0602873,17.9215797 L18.3779033,18.1021658 L19.0257374,18.4800691 L18.2699309,19.7757374 L17.6220967,19.3978342 C13.960243,17.2617528 10.3506039,17.2024172 6.69165094,19.2198274 L6.37790327,19.3978342 L5.73006909,19.7757374 L4.97426256,18.4800691 L5.62209673,18.1021658 Z" id="Path-2" fill={'#ffffff'} fillRule="nonzero"></path>
        </g>
    </svg>
);
UpSvg.propTypes = {
    isMobile: PropTypes.bool.isRequired
};

const DownSvg = ({ isMobile }) => (
    <svg width={isMobile ? mobileIconSize : iconSize} height={isMobile ? mobileIconSize : iconSize} viewBox="0 0 24 24">
        <g id="3D-downward" stroke="none" strokeWidth="1" fillRule="nonzero">
            <path d="M15,9 L12,12 L9,9 M12,10.5 L12,4.5" id="Combined-Shape" stroke={'#ffffff'} strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M5.62209673,18.1021658 C9.74978057,15.6943503 13.9299778,15.6341549 18.0602873,17.9215797 L18.3779033,18.1021658 L19.0257374,18.4800691 L18.2699309,19.7757374 L17.6220967,19.3978342 C13.960243,17.2617528 10.3506039,17.2024172 6.69165094,19.2198274 L6.37790327,19.3978342 L5.73006909,19.7757374 L4.97426256,18.4800691 L5.62209673,18.1021658 Z" id="Path-2" fill={'#ffffff'} fillRule="nonzero"></path>
        </g>
    </svg>
);
DownSvg.propTypes = {
    isMobile: PropTypes.bool.isRequired
};

const MapControlsContainer = styled.div`
    margin-top: 10px;
    display: flex;
`;

const MapControlContainer = styled.div`
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    margin: 0 auto;
    z-index: 15000;
    margin-bottom: 5px;
    box-shadow: ${iconShadow};
    -moz-box-shadow: ${iconShadow};
    -webkit-box-shadow: ${iconShadow};
    -o-box-shadow: ${iconShadow};
    background-color: ${darkBgColor};
`;

const MapControl = styled.div`
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    margin: 0;
    padding-top:3px;
    text-align: center;
`;

const MobileContainer = styled.div`
    float:left;
    margin-top: 5px;
    margin-right: 5px;
`;

const upDownClickHandler = (directionUp) => {
    const mapmodule = Oskari.getSandbox().getStatefulComponents().mapfull.getMapModule();
    const cam = mapmodule.getCamera();
    if (directionUp) {
        cam.location.altitude = cam.location.altitude * ((100 + upDownChangePercent) / 100);
    } else {
        cam.location.altitude = cam.location.altitude * ((100 - upDownChangePercent) / 100);
    }
    mapmodule.setCamera(cam);
    Oskari.getSandbox().postRequestByName('MapMoveRequest');
};

const CameraControls3d = ({ mapInMobileMode, getMessage }) => {
    const upControl = <Icon style={{ outline: 'none' }} component={() => <UpSvg isMobile={mapInMobileMode}/>} onClick={() => upDownClickHandler(true)} title = {getMessage('tooltip.up')}/>;
    const downControl = <Icon style={{ outline: 'none' }} component={() => <DownSvg isMobile={mapInMobileMode}/>} onClick={() => upDownClickHandler(false)} title = {getMessage('tooltip.down')}/>;

    let controls;

    if (!mapInMobileMode) {
        controls = <MapControlsContainer>
            <MapControlContainer>
                <MapControl>{upControl}</MapControl>
            </MapControlContainer>
            <MapControlContainer>
                <MapControl>{downControl}</MapControl>
            </MapControlContainer>
        </MapControlsContainer>;
    } else {
        controls = <MobileContainer>
            {upControl}
            {downControl}
        </MobileContainer>;
    }
    return (controls);
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(CameraControls3d);
export { contextWrap as CameraControls3d };
