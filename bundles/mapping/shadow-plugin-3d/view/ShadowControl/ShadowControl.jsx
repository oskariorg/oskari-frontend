import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withLocale } from 'oskari-ui/util';
import { ShadowIcon } from '../../resources/icons/ShadowIcon';

const darkBgColor = 'rgba(20,20,20,0.8)';
const secondaryColor = '#006ce8';

const MapControlsContainer = styled.div`
    margin-top: 10px;
    margin-left: 5px;
    display: flex;
    flex-wrap: wrap;
    width: 80px;
    align-items: center;
`;

const MapControlContainer = styled.div`
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 15000;
    margin-bottom: 5px;
    margin-left: 5px;
    box-shadow: '1px 1px 2px rgba(0,0,0,0.6)';
    background-color: ${props => props.controlIsActive && !props.isMobile ? secondaryColor : darkBgColor};
`;

const MapControl = styled.div`
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    margin: 0;
    padding-top:3px;
    text-align: center;
`;

const ShadowControl = ({ mapInMobileMode }) => {
    return (
        <MapControlsContainer>
            <MapControlContainer>
                <MapControl>
                    <ShadowIcon isMobile={mapInMobileMode} />
                </MapControl>
            </MapControlContainer>
        </MapControlsContainer>
    );
};
ShadowControl.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired
};

const contextWrap = withLocale(ShadowControl);
export { contextWrap as ShadowControl };
