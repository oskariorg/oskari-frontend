import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ColAuto, ColAutoRight } from './Grid';
import { Slider, Icon, NumberInput } from 'oskari-ui';
import { DataLayerIcon, ImageLayerIcon, TimeSerieIcon, UserDataIcon, ThemeMapIcon, ThreeDIcon } from './CustomIcons/CustomIcons';

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
    } else if (type === 'myplaces' || type === 'analysis' || type === 'userlayer') {
        return (
            <UserDataIcon style={{ marginTop: '5px' }} title={type} />
        );
    } else if (type === 'timeseries') {
        return (
            <TimeSerieIcon style={{ marginTop: '5px' }} title={type} />
        );
    } else if (type === 'thememap') {
        return (
            <ThemeMapIcon style={{ marginTop: '5px' }} title={type} />
        );
    // this is wrong :D
    } else if (type === '3d') {
        return (
            <ThreeDIcon style={{ marginTop: '5px' }} title={type} />
        );
    }
    return (
        <DataLayerIcon style={{ marginTop: '5px' }} title={type} />
    );
};

LayerIcon.propTypes = {
    type: PropTypes.string
};

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

export const LayerInfoBox = ({ layerType, slider, handleOpacityChange, handleOpenMenu }) => {
    return (
    <>
        <ColAuto>
            <LayerIcon type={layerType} />
        </ColAuto>
        {/* conditional stuff under here */}
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
    layerType: PropTypes.string.isRequired,
    slider: PropTypes.number.isRequired,
    handleOpacityChange: PropTypes.func.isRequired,
    handleOpenMenu: PropTypes.func.isRequired
};
