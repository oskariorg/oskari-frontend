import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withLocale } from 'oskari-ui/util';
import { ShadowIcon } from '../../resources/icons/';

const darkBgColor = 'rgba(20,20,20,0.8)';
const secondaryColor = '#006ce8';

const MapControlsContainer = styled.div`
    margin: 0 0 10px 30px;
    display: flex;
    flex-wrap: wrap;
    width: 32px;
    align-items: center;
`;

const MapControl = styled.div`
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 15000;
    box-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    background-color: ${props => props.controlIsActive && !props.isMobile ? secondaryColor : darkBgColor};
    background-repeat: no-repeat;
    margin: 0;
    text-align: center;
`;

const ShadowControl = ({ mapInMobileMode }) => {
    return (
        <MapControlsContainer>
            <MapControl>
                <ShadowIcon isMobile={mapInMobileMode} style={{ paddingTop: '3px' }} />
            </MapControl>
        </MapControlsContainer>
    );
};
ShadowControl.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired
};

const contextWrap = withLocale(ShadowControl);
export { contextWrap as ShadowControl };
