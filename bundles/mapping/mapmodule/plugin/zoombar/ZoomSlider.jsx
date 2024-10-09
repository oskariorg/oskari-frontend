import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';
import { Slider } from 'oskari-ui';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ThemeConsumer, ThemeProvider } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';
import { TextIcon } from 'oskari-ui/components/icons';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px 10px 10px;
`;

const StyledSlider = styled(Slider)`
    height: 150px;
    opacity: ${props => props.opacity};
    margin: 6px 10px;
    left: -1px;
    .ant-slider-mark-text {
        color: #ffffff;
    }
    .ant-slider-dot {
        height: 1px;
        background: ${props => props.dotColor};
        border: none;
        width: 7px;
        left: 0;
        opacity: 50%;
    }
    .ant-slider-rail,
    .ant-slider-track,
    .ant-slider-step {
        width: 7px;
        background: ${props => props.railBackground};
        border-radius: 5px;
        box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 60%);
        &:hover {
            background: ${props => props.railBackground};
        }
        &:focus {
            background: ${props => props.railBackground};
        }
        &:active {
            background: ${props => props.railBackground};
        }
    }
    .ant-slider-handle {
        background: ${props => props.handleBackground};
        border: 4px solid ${props => props.handleBorder};
        box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 60%);
        border-radius: ${props => props.rounding || '0%'};
        width: 14px;
        height: 14px;
        left: 0;
        &:hover {
            background: ${props => props.handleBackground};
            border: 4px solid ${props => props.handleBorder};
        }
        &:focus {
            background: ${props => props.handleBackground};
            border: 4px solid ${props => props.handleBorder};
        }
        &:active {
            background: ${props => props.handleBackground};
            border: 4px solid ${props => props.handleBorder};
        }
    }
    .ant-slider-handle::after, .ant-slider-handle:hover::after {
        background: none;
        box-shadow: none !important;
    }
    .ant-slider:hover .ant-slider-handle::after {
        box-shadow: none!important;
    }
    `;

const MobileContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const ThemedSlider = ThemeConsumer(({theme = {}, ...rest}) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const rounding = helper.getButtonRoundness();
    const opacity = helper.getButtonOpacity();
    return (
        <StyledSlider
            railBackground={bgColor}
            handleBackground={bgColor}
            dotColor={icon}
            rounding={rounding}
            handleBorder={icon}
            opacity={opacity}
            {...rest}
        />
    );
});

export const ZoomSlider = ({ changeZoom, zoom = 0, maxZoom, isMobile = false, ...rest }) => {
    const marks = {};
    for (let i = maxZoom; i > 0; i--) {
        marks[i] = { label: null };
    }

    if (isMobile) {
        return (
            <MobileContainer>
                <MapModuleButton
                    icon={<PlusOutlined />}
                    onClick={() => {
                        changeZoom(zoom < 100 ? zoom + 1 : 100);
                    }}
                    className='t_plus'
                />
                <MapModuleButton
                    icon={<MinusOutlined />}
                    onClick={() => {
                        changeZoom(zoom > 0 ? zoom - 1 : 0);
                    }}
                    className='t_minus'
                />
            </MobileContainer>
        );
    }

    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    // Use text icon for desktop as we are using small buttons and icons.
    // Antd 5+ Minus/PlusOutlined icon rendering doesn't look nice with small buttons
    // Note! minus icon text is minus sign (U+2212, not hyphen)
    return (
        <Container>
            <MapModuleButton
                icon={<TextIcon text='+'/>}
                className='t_plus'
                onClick={() => {
                    changeZoom(zoom < 100 ? zoom + 1 : 100);
                }}
                iconSize='14px'
                size='18px'
                noMargin
            />

            <ThemeProvider value={mapModule.getMapTheme()}>
                <ThemedSlider
                    className='t_zoomslider'
                    vertical={true}
                    value={zoom}
                    step={1}
                    dots
                    max={maxZoom}
                    min={0}
                    onChange={value => {
                        changeZoom(value);
                    }}
                    {...rest}
                />
            </ThemeProvider>

            <MapModuleButton
                icon={<TextIcon text='−'/>}
                className='t_minus'
                onClick={() => {
                    changeZoom(zoom > 0 ? zoom - 1 : 0);
                }}
                iconSize='14px'
                size='18px'
                noMargin
            />
        </Container>
    );
};
