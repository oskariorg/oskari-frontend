import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LocaleConsumer } from 'oskari-ui/util';
import { ControlIcon } from './icons';

const DesktopContainer = styled.div`
    margin: 0 0 10px 30px;
    width: 32px;
    height: 32px;
    background-color: rgba(20,20,20,0.8);
    border-radius: 50%;
    z-index: 15000;
    cursor: pointer;
    box-shadow: 1px 1px 2px rgba(0,0,0,0.6);
`;

const StyledControl = styled.div`
    width: 32px;
    height: 32px;
    margin: 0;
    text-align: center;
    background-repeat: no-repeat;
    padding-top: 4px;
`;

const ShadowControl = ({ isMobile, controlIsActive }) => {
    if (isMobile) {
        return (
            <ControlIcon isMobile={isMobile} controlIsActive={controlIsActive}/>
        );
    }
    return (
        <DesktopContainer>
            <StyledControl>
                <ControlIcon isMobile={isMobile} controlIsActive={controlIsActive}/>
            </StyledControl>;
        </DesktopContainer>
    );
};

ShadowControl.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    controlIsActive: PropTypes.bool.isRequired
};

const contextWrap = LocaleConsumer(ShadowControl);
export { contextWrap as TimeControl3dButton };
