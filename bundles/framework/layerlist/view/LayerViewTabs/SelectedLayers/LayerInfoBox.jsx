import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto } from './Grid';
import { Slider, NumberInput } from 'oskari-ui';

const StyledSlider = styled.div`
    border-radius: 4px;
    width: 150px;
    padding: 10px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 50px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
`;

const Percentage = styled.span`
    margin-left: 5px;
`;

const LayerSlider = ({ slider, handleOpacityChange }) => (
    <Fragment>
        <ColAuto >
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
            />
            <Percentage>%</Percentage>
        </ColAuto>
    </Fragment>
);

LayerSlider.propTypes = {
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired
};

export const LayerScaleBox = () => {
    return (
        <Fragment>
            :D
        </Fragment>
    );
};

export const LayerInfoBox = ({ slider, handleOpacityChange }) => {
    return (
        <Fragment>
            <LayerSlider
                slider={slider}
                handleOpacityChange={handleOpacityChange}
            />
        </Fragment>
    );
};

LayerInfoBox.propTypes = {
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired
};
