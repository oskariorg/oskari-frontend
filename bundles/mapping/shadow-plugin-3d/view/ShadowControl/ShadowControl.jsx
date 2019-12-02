import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withLocale } from 'oskari-ui/util';
import { ShadowIcon } from './ShadowIcon';

const iconShadow = '1px 1px 2px rgba(0,0,0,0.6)';
const darkBgColor = 'rgba(20,20,20,0.8)';
// TODO: Change secondary color reference later when global way available
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
    box-shadow: ${iconShadow};
    -moz-box-shadow: ${iconShadow};
    -webkit-box-shadow: ${iconShadow};
    -o-box-shadow: ${iconShadow};
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

const openShadowTool = () => {
    console.log('openTool');
};

const ShadowControl = ({ getMessage }) => {
    return (
        <MapControlsContainer>
            <MapControlContainer>
                <MapControl>
                    <ShadowIcon clickHandler={() => {
                        openShadowTool();
                    }} />
                </MapControl>
            </MapControlContainer>
        </MapControlsContainer>
    );
};
ShadowControl.propTypes = {
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(ShadowControl);
export { contextWrap as ShadowControl };
