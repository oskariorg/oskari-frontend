import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto, ColAutoRight } from './Grid';
import { Slider, Icon, NumberInput } from 'oskari-ui';
import { DataLayerIcon, ImageLayerIcon } from './CustomIcons/CustomIcons';

const StyledSlider = styled.div`
    border: solid 2px #d9d9d9;
    border-radius: 4px;
    width: 150px;
    padding: 8px 15px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 70px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
`;

const LayerIcon = ({ type }) => {
    if (type === 'wmts') {
        return (
            <ImageLayerIcon style={{ marginTop: '5px' }} title={type} />
        );
    }
    return (
        <DataLayerIcon style={{ marginTop: '5px' }} title={type} />
    );
};

LayerIcon.propTypes = {
    type: PropTypes.string
};

export const LayerInfoBox = ({ layerType, slider, handleOpacityChange, handleOpenMenu }) => (
    <>
        <ColAuto>
            <LayerIcon type={layerType} />
        </ColAuto>
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
        <ColAutoRight>
            <Icon
                type="menu"
                onClick={handleOpenMenu}
                style={{ color: '#006ce8', fontSize: '16px', marginTop: '8px' }}
            />
        </ColAutoRight>
    </>
);

LayerInfoBox.propTypes = {
    layerType: PropTypes.string.isRequired,
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired,
    handleOpenMenu: PropTypes.func.isRequired
};
