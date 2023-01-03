import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';
import { Slider } from 'oskari-ui';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ThemeConsumer, ThemeProvider } from '../../../../../src/react/util';
import { getNavigationTheme } from '../../../../../src/react/theme';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px 10px 10px;
`;

const StyledSlider = styled(Slider)`
    height: 150px;
    .ant-slider-mark-text {
        color: #ffffff;
    }
    .ant-slider-dot {
        height: 1px;
        background: ${props => props.dotColor};
        border: none;
        width: 7px;
        left: 4px;
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
`;

const MobileContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const PlusIcon = styled(PlusOutlined)`
    font-size: 12px;
`;

const MinusIcon = styled(MinusOutlined)`
    font-size: 12px;
`;

const ThemedSlider = ThemeConsumer(({theme = {}, ...rest}) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const rounding = helper.getButtonRoundness();
    return (
        <StyledSlider
            railBackground={bgColor}
            handleBackground={bgColor}
            dotColor={icon}
            rounding={rounding}
            handleBorder={icon}
            {...rest}
        />
    )
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
                    icon={<PlusIcon />}
                    onClick={() => {
                        changeZoom(zoom < 100 ? zoom + 1 : 100)
                    }}
                    size='32px'
                    className='t_plus'
                />
                <MapModuleButton
                    icon={<MinusIcon />}
                    onClick={() => {
                        changeZoom(zoom > 0 ? zoom - 1 : 0)
                    }}
                    size='32px'
                    className='t_minus'
                />
            </MobileContainer>
        );
    }

    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    return (
        <Container>
            <MapModuleButton
                icon={<PlusIcon />}
                className='t_plus'
                onClick={() => {
                    changeZoom(zoom < 100 ? zoom + 1 : 100)
                }}
                size='18px'
                noMargin
            />
            {!isMobile && (
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
            )}
            <MapModuleButton
                icon={<MinusIcon />}
                className='t_minus'
                onClick={() => {
                    changeZoom(zoom > 0 ? zoom - 1 : 0)
                }}
                size='18px'
                noMargin
            />
        </Container>
    );
}
