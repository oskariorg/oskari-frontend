import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Divider, Message, Slider, Checkbox, Dropdown, Button, Select, Option, NumberInput } from 'oskari-ui';
import { ColorPicker } from 'oskari-ui/components/ColorPicker';

const BUNDLE_KEY = 'Publisher2';

const Content = styled('div')`
    margin-top: 10px;
`;

const Field = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const StyledColorPicker = styled('div')`
    display: flex;
    flex-direction: row;
    width: 165px;
`;

const StyledSlider = styled(Slider)`
    width: 285px;
    margin: 0 15px 0 5px;
    .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider-handle {
        border: #0091ff solid 2px;
        margin-top: -6px;
    }
    &:hover .ant-slider-track {
        background-color: #003fc3 !important;
    }
    &:hover .ant-slider-handle {
        border: #003fc3 solid 2px !important;
    }
`;

const SliderContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 65px;
    margin: 0 5px 0 -1px;
`;

const NumberInputContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

const NumberSuffix = styled('span')`
    margin: 0;
    padding-top: 5px;
`;

const StyledSelect = styled(Select)`
    width: 200px;
`;

export const PanelToolStyles = ({ mapTheme, changeTheme, fonts }) => {
    const [font, setFont] = useState(mapTheme?.font || fonts[0].val);
    const [popupHeader, setPopupHeader] = useState(mapTheme?.color?.header?.bg);
    const [popupHeaderText, setPopupHeaderText] = useState(mapTheme?.color?.header?.text);

    const [buttonBackground, setButtonBackground] = useState(mapTheme?.navigation?.color?.primary);
    const [buttonText, setButtonText] = useState(mapTheme?.navigation?.color?.text);
    const [buttonAccent, setButtonAccent] = useState(mapTheme?.navigation?.color?.accent);
    const [buttonRounding, setButtonRounding] = useState(mapTheme?.navigation?.roundness);
    const [buttonEffect, setButtonEffect] = useState(mapTheme?.navigation?.effect);

    useEffect(() => {
        const theme = {
            ...mapTheme,
            font,
            color: {
                ...mapTheme.color,
                header: {
                    ...mapTheme.color.header,
                    bg: popupHeader,
                    text: popupHeaderText,
                    icon: popupHeaderText
                },
                accent: buttonAccent
            },
            navigation: {
                ...mapTheme.navigation,
                color: {
                    ...mapTheme.navigation.color,
                    primary: buttonBackground,
                    accent: buttonAccent,
                    text: buttonText
                },
                roundness: buttonRounding,
                effect: buttonEffect
            }
        };
        changeTheme(theme);
    }, [font, popupHeader, popupHeaderText, buttonBackground, buttonText, buttonAccent, buttonRounding, buttonEffect]);

    const setPreset = (style) => {
        let rounding = 100;
        let popupBg = '#3c3c3c';
        let buttonBg = '#141414';
        let icon = '#ffffff';
        let hover = '#ffd400';
        let effect = undefined;

        if (style.includes('sharp')) {
            rounding = 0;
        }
        if (style.includes('light')) {
            popupBg = '#ffffff';
            buttonBg = '#ffffff';
            icon = '#000000';
        }
        if (style.includes('3d')) {
            rounding = 20;
            effect = '3D';
        }

        setPopupHeader(popupBg);
        setButtonRounding(rounding);
        setButtonBackground(buttonBg);
        setButtonText(icon);
        setButtonAccent(hover);
        setButtonEffect(effect);
        setPopupHeaderText(icon);
    };

    const toolStyles = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.fields.toolStyles') || {};

    return (
        <Content>
            <Field>
                <Dropdown items={Object.keys(toolStyles).map(key => (
                    {
                        title: toolStyles[key],
                        action: () => setPreset(key)
                    }
                ))}>
                    <Button>
                        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.presets' />
                    </Button>
                </Dropdown>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.fonts.label' />
                <StyledSelect
                    value={font}
                    onChange={val => {
                        setFont(val);
                    }}
                >
                    {fonts.map(font => (
                        <Option key={font.val}>{font.name}</Option>
                    ))}
                </StyledSelect>
            </Field>
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.buttons' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonBackgroundColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonBackground}
                        onChange={setButtonBackground}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonText}
                        onChange={setButtonText}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonAccentColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonAccent}
                        onChange={setButtonAccent}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonRounding' />
                <SliderContainer>
                    <StyledSlider
                        value={buttonRounding}
                        onChange={val => setButtonRounding(val)}
                    />
                    <NumberInputContainer>
                        <StyledNumberInput
                            min={0}
                            max={100}
                            value={buttonRounding}
                            onChange={val => setButtonRounding(val)}
                        />
                        <NumberSuffix>
                            %
                        </NumberSuffix>
                    </NumberInputContainer>
                </SliderContainer>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.effect' />
                <Checkbox
                    checked={buttonEffect === '3D'}
                    onChange={e => setButtonEffect(e.target.checked ? '3D' : undefined)}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.3d' />
                </Checkbox>
            </Field>
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.popup' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.popupHeaderColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={popupHeader}
                        onChange={setPopupHeader}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.popupHeaderTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={popupHeaderText}
                        onChange={setPopupHeaderText}
                    />
                </StyledColorPicker>
            </Field>
        </Content>
    );
};
