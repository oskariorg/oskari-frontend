import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Divider, Message, Slider, Checkbox, Dropdown, Button, Select, Option, NumberInput } from 'oskari-ui';
import { ColorPicker } from 'oskari-ui/components/ColorPicker';
import { PropTypes } from 'prop-types';
import { getDefaultMapTheme } from '../../..//mapping/mapmodule/util/MapThemeHelper.js';
import { INFOBOX_PREVIEW_ID } from '../handler/PanelLayoutHandler.js';
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

const SliderContainer = styled('div')`
    width: 285px;
    margin-left: 5px;
`;

const ButtonRounding = styled('div')`
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
    margin-left: 15px;
`;

const NumberSuffix = styled('span')`
    margin: 0;
    padding-top: 5px;
`;

const StyledSelect = styled(Select)`
    width: 200px;
`;

const toggleInfoboxPreview = (visible) => {
    if (!visible) {
        Oskari.getSandbox().postRequestByName('InfoBox.HideInfoBoxRequest', [INFOBOX_PREVIEW_ID]);
        return;
    }

    showOrUpdateInfobox();
};

const showOrUpdateInfobox = () => {
    const sandbox = Oskari.getSandbox();
    const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
    const location = mapmodule.getMapCenter();
    const title = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.popup.gfiDialog.title');
    const featureName = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.popup.gfiDialog.featureName');
    const featureDesc = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.popup.gfiDialog.featureDesc');

    const infoboxContent = [
        {
            html: '<div class="getinforesult_header">' +
                    '<div class="icon-bubble-left">' +
                '</div>' +
                '<div title="' + title + '" class="getinforesult_header_title">' + featureName + '</div>' +
                '</div>' +
                '<div>' +
                    featureDesc +
                '</div>'
        }
    ];

    const infoboxData = [
        INFOBOX_PREVIEW_ID,
        Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.popup.gfiDialog.title'),
        infoboxContent,
        {
            ...location
        },
        {
            hidePrevious: true
        }
    ];
    sandbox.postRequestByName('InfoBox.ShowInfoBoxRequest', infoboxData);
};

export const PanelToolStyles = ({ mapTheme, changeTheme, fonts, infoBoxPreviewVisible, updateInfoBoxPreviewVisible }) => {
    const [font, setFont] = useState(mapTheme?.font || fonts[0].val);
    const [popupHeader, setPopupHeader] = useState(mapTheme?.color?.header?.bg);
    const [popupHeaderText, setPopupHeaderText] = useState(mapTheme?.color?.header?.text);

    const [infoboxHeader, setInfoboxHeader] = useState(mapTheme?.infobox?.header?.bg);
    const [infoboxHeaderText, setInfoboxHeaderText] = useState(mapTheme?.infobox?.header?.text);

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
            },
            infobox: {
                ...mapTheme.infobox,
                header: {
                    bg: infoboxHeader,
                    text: infoboxHeaderText
                }
            }
        };
        changeTheme(theme);
        toggleInfoboxPreview(infoBoxPreviewVisible);
    }, [font, popupHeader, popupHeaderText, infoboxHeader, infoboxHeaderText, infoBoxPreviewVisible, buttonBackground, buttonText, buttonAccent, buttonRounding, buttonEffect]);

    const setPreset = (style) => {
        let rounding = 100;
        let popupBg = '#3c3c3c';
        let buttonBg = '#141414';
        let icon = '#ffffff';
        let effect;
        const hover = '#ffd400';

        // reset infobox to defaults
        const infoboxDefaults = getDefaultMapTheme()?.infobox;
        const infoboxHeader = infoboxDefaults?.header?.bg;
        const infoboxHeaderText = infoboxDefaults?.header?.text;

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
        setInfoboxHeader(infoboxHeader);
        setInfoboxHeaderText(infoboxHeaderText);
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
                <ButtonRounding>
                    <SliderContainer>
                        <Slider noMargin
                            value={buttonRounding}
                            onChange={val => setButtonRounding(val)}/>
                    </SliderContainer>
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
                </ButtonRounding>
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
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.infobox' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxHeaderColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={infoboxHeader}
                        onChange={setInfoboxHeader}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxHeaderTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={infoboxHeaderText}
                        onChange={setInfoboxHeaderText}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Checkbox checked={infoBoxPreviewVisible} onChange={ () => updateInfoBoxPreviewVisible(!infoBoxPreviewVisible) }>
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxPreview'/>
                </Checkbox>
            </Field>
        </Content>
    );
};

PanelToolStyles.propTypes = {
    mapTheme: PropTypes.object,
    changeTheme: PropTypes.func,
    fonts: PropTypes.array,
    infoBoxPreviewVisible: PropTypes.bool,
    updateInfoBoxPreviewVisible: PropTypes.func
};
