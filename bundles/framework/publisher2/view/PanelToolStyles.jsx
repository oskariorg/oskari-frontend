import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Message, Opacity, Checkbox, Dropdown, Button, Select, Option } from 'oskari-ui';
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

const StyledSlider = styled(Opacity)`
    width: 285px;
`;

const StyledSelect = styled(Select)`
    width: 200px;
`;

const fonts = [
    {
        name: 'Arial (sans-serif)',
        val: 'arial'
    },
    {
        name: 'Georgia (serif)',
        val: 'georgia'
    }
];

export const PanelToolStyles = ({ mapTheme, changeTheme, fontValue, changeFont }) => {
    const [font, setFont] = useState(fontValue)
    const [popupHeader, setPopupHeader] = useState(mapTheme?.color?.header?.bg);
    const [buttonBackground, setButtonBackground] = useState(mapTheme?.navigation?.color?.primary);
    const [buttonText, setButtonText] = useState(mapTheme?.navigation?.color?.text);
    const [buttonAccent, setButtonAccent] = useState(mapTheme?.navigation?.color?.accent);
    const [buttonRounding, setButtonRounding] = useState(mapTheme?.navigation?.roundness);
    const [buttonEffect, setButtonEffect] = useState(mapTheme?.navigation?.effect);

    useEffect(() => {
        const theme = {
            ...mapTheme,
            color: {
                ...mapTheme.color,
                header: {
                    ...mapTheme.color.header,
                    bg: popupHeader
                }
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
    }, [popupHeader, buttonBackground, buttonText, buttonAccent, buttonRounding, buttonEffect]);

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
                        changeFont({ font: val });
                    }}
                >
                    {fonts.map(font => (
                        <Option key={font.val}>{font.name}</Option>
                    ))}
                </StyledSelect>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.popupHeaderColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={popupHeader}
                        onChange={(e) => setPopupHeader(e.target.value)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonBackgroundColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonBackground}
                        onChange={(e) => setButtonBackground(e.target.value)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonAccentColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={buttonAccent}
                        onChange={(e) => setButtonAccent(e.target.value)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonRounding' />
                <StyledSlider
                    defaultValue={buttonRounding}
                    onChange={val => setButtonRounding(val)}
                />
            </Field>
            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.effect' />
            <Field>
                <Checkbox
                    checked={buttonEffect === '3D'}
                    onChange={e => setButtonEffect(e.target.checked ? '3D' : undefined)}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.3d' />
                </Checkbox>
            </Field>
        </Content>
    );
};
