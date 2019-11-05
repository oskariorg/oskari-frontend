import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto, ColAutoRight } from './Grid';
import { Slider, Icon, NumberInput } from 'oskari-ui';

const StyledSlider = styled.div`
    border-radius: 4px;
    width: 150px;
    padding: 12px 19px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 70px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
`;

const LayerSlider = ({ slider, handleOpacityChange }) => (
    <>
        <ColAuto>
            <StyledSlider>
                <Slider
                    value={slider}
                    onChange={handleOpacityChange}
                    style={{ margin: '0px' }}
                />
            </StyledSlider>
        </ColAuto>
        <ColAuto>
            <StyledNumberInput
                min={0}
                max={100}
                value={slider}
                onChange={handleOpacityChange}
                formatter={value => `${value} %`}
            />
        </ColAuto>
    </>
);

LayerSlider.propTypes = {
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired
};

const LayerScaleBox = () => {
    return (
        <>
            :D
        </>
    );
};

export const LayerInfoBox = ({ slider, handleOpacityChange, handleOpenMenu }) => {
    return (
    <>
        <LayerSlider
            slider={slider}
            handleOpacityChange={handleOpacityChange}
        />
        <ColAutoRight>
            <Icon
                type="menu"
                onClick={handleOpenMenu}
                style={{ color: '#006ce8', fontSize: '16px', marginTop: '8px' }}
            />
        </ColAutoRight>
    </>
    );
};

LayerInfoBox.propTypes = {
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired,
    handleOpenMenu: PropTypes.func.isRequired
};
