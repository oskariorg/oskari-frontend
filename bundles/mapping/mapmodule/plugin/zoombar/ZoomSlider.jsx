import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';
import { Slider } from 'oskari-ui';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 15px 0 30px;
`;

const StyledSlider = styled(Slider)`
    margin: -5px 17px 10px 0;
    height: 150px;
    .ant-slider-mark-text {
        color: #ffffff;
    }
    .ant-slider-dot {
        height: 1px;
        background-color: ${props => props.styles.dotColor};
        border: none;
        width: 7px;
        left: 4px;
        opacity: 50%;
    }
    .ant-slider-rail,
    .ant-slider-track,
    .ant-slider-step {
        width: 7px;
        background-color: ${props => props.styles.railBackground};
        border-radius: ${props => props.styles.railRounding};
        box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 60%);
        &:hover {
            background-color: ${props => props.styles.railBackground};
        }
        &:focus {
            background-color: ${props => props.styles.railBackground};
        }
        &:active {
            background-color: ${props => props.styles.railBackground};
        }
    }
    .ant-slider-handle {
        background: ${props => props.styles.handleBackground};
        border: ${props => props.styles.handleBorder};
        box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 60%);
        border-radius: ${props => props.styles.handleRounding};
        width: ${props => props.styles.handleWidth};
        &:hover {
            background: ${props => props.styles.handleBackground};
            border: ${props => props.styles.handleBorder};
        }
        &:focus {
            background: ${props => props.styles.handleBackground};
            border: ${props => props.styles.handleBorder};
        }
        &:active {
            background: ${props => props.styles.handleBackground};
            border: ${props => props.styles.handleBorder};
        }
    }
`;

const PlusIcon = styled(PlusOutlined)`
    font-size: 12px;
`;

const MinusIcon = styled(MinusOutlined)`
    font-size: 12px;
`;

const STYLE_ROUNDED_DARK = {
    railBackground: '#3c3c3c',
    railRounding: '5px',
    dotColor: '#ffffff',
    handleBackground: '#3c3c3c',
    handleBorder: '4px solid #ffffff',
    handleWidth: '14px',
    handlerounding: '50%'
};

const STYLE_ROUNDED_LIGHT = {
    railBackground: '#ffffff',
    railRounding: '5px',
    dotColor: '#3c3c3c',
    handleBackground: '#ffffff',
    handleBorder: '4px solid #3c3c3c',
    handleWidth: '14px',
    handleRounding: '50%'
};

const STYLE_SHARP_DARK = {
    railBackground: '#3c3c3c',
    railRounding: '2px',
    dotColor: '#ffffff',
    handleBackground: '#3c3c3c',
    handleBorder: '4px solid #ffffff',
    handleWidth: '18px',
    handleRounding: '2px'
};

const STYLE_SHARP_LIGHT = {
    railBackground: '#ffffff',
    railRounding: '2px',
    dotColor: '#3c3c3c',
    handleBackground: '#ffffff',
    handleBorder: '4px solid #3c3c3c',
    handleWidth: '18px',
    handleRounding: '2px'
};

const STYLE_3D_DARK = {
    railBackground: '#3c3c3c',
    railRounding: '2px',
    dotColor: '#ffffff',
    handleBackground: 'linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(240,240,240,1) 35%,rgba(221,221,221,1) 100%)',
    handleBorder: 'none',
    handleWidth: '18px',
    handleRounding: '5px'
};

const STYLE_3D_LIGHT = {
    railBackground: '#ffffff',
    railRounding: '2px',
    dotColor: '#3c3c3c',
    handleBackground: 'linear-gradient(180deg,rgba(101,101,101,1) 0%,rgba(60,60,60,1) 35%,rgba(9,9,9,1) 100%)',
    handleBorder: 'none',
    handleWidth: '18px',
    handleRounding: '5px'
};

export const ZoomSlider = ({ changeZoom, zoom = 0, maxZoom, styleName = 'rounded-dark', isMobile = false }) => {
    const marks = {};
    for (let i = maxZoom; i > 0; i--) {
        marks[i] = { label: null };
    }

    let styles;
    switch (styleName) {
        case 'rounded-dark':
            styles = STYLE_ROUNDED_DARK;
            break;
        case 'rounded-light':
            styles = STYLE_ROUNDED_LIGHT;
            break;
        case 'sharp-dark':
            styles = STYLE_SHARP_DARK;
            break;
        case 'sharp-light':
            styles = STYLE_SHARP_LIGHT;
            break;
        case '3d-dark':
            styles = STYLE_3D_DARK;
            break;
        case '3d-light':
            styles = STYLE_3D_LIGHT;
            break;
        default:
            styles = STYLE_ROUNDED_DARK;
            break;
    }

    if (isMobile) {
        return (
            <div>
                <MapModuleButton
                    icon={<PlusIcon />}
                    onClick={() => {
                        changeZoom(zoom < 100 ? zoom + 1 : 100)
                    }}
                    size='32px'
                    styleName={styleName}
                />
                <MapModuleButton
                    icon={<MinusIcon />}
                    onClick={() => {
                        changeZoom(zoom > 0 ? zoom - 1 : 0)
                    }}
                    size='32px'
                    styleName={styleName}
                />
            </div>
        );
    }

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
                styleName={styleName}
            />
            {!isMobile && (
                <StyledSlider
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
                    styles={styles}
                />
            )}
            <MapModuleButton
                icon={<MinusIcon />}
                className='t_minus'
                onClick={() => {
                    changeZoom(zoom > 0 ? zoom - 1 : 0)
                }}
                size='18px'
                noMargin
                styleName={styleName}
            />
        </Container>
    );
}
