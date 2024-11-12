import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import styled from 'styled-components';
import { Slider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ThemeConsumer, ThemeProvider } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';
import { TextIcon } from 'oskari-ui/components/icons';

const width = '8px';

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
    margin: 6px 0;
    left: -1px;

    .ant-slider-handle::after {
        display: none;
    }

    .ant-slider-mark-text {
        color: #ffffff;
    }

    .ant-slider-dot {
        height: 1px;
        background: ${props => props.dotColor};
        border: none;
        width: ${width};
        left: 0;
        opacity: 50%;
    }
`;

const MobileContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const ThemedSlider = ThemeConsumer(({ theme = {}, ...rest }) => {
    const helper = getNavigationTheme(theme);

    const backgroundColor = helper.getButtonColor();
    const boxShadow = '0px 1px 2px 1px rgb(0 0 0 / 60%)';
    const slider = { width, backgroundColor, boxShadow, borderRadius: '5px' };
    const styles = {
        track: slider,
        rail: slider,
        handle: {
            width: '14px',
            height: '14px',
            backgroundColor,
            boxShadow,
            border: `4px solid ${helper.getTextColor()}`,
            borderRadius: helper.getButtonRoundness() || '0%'
        }
    };
    return (
        <StyledSlider
            styles={styles}
            dotColor={helper.getTextColor()}
            opacity={helper.getButtonOpacity()}
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
