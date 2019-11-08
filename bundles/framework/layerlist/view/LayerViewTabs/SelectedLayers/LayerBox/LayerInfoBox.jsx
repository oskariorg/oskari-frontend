import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto } from './Grid';
import { Slider, NumberInput, InputGroup } from 'oskari-ui';

const StyledSlider = styled.div`
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    width: 120px;
    padding: 10px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 60px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
    height: 34px !important;
`;

const StyledLink = styled.a`
    cursor: pointer;
`;

export const LayerScaleLocateBox = ({ handleClick, text }) => {
    return (
        <ColAuto>
            <StyledLink onClick={handleClick}>{text}</StyledLink>
        </ColAuto>
    );
};

LayerScaleLocateBox.propTypes = {
    handleClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
};

export const LayerInfoBox = ({ slider, handleOpacityChange }) => {
    return (
        <Fragment>
            <ColAuto>
                <InputGroup compact>
                    <StyledSlider>
                        <Slider
                            value={slider}
                            onChange={handleOpacityChange}
                            style={{ margin: '0px' }}
                        />
                    </StyledSlider>
                    <StyledNumberInput
                        min={0}
                        max={100}
                        value={slider}
                        onChange={handleOpacityChange}
                        formatter={value => `${value} %`}
                    />
                </InputGroup>
            </ColAuto>
        </Fragment>
    );
};

LayerInfoBox.propTypes = {
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired
};
