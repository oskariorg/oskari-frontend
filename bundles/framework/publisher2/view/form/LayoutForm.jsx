import React, { useState } from 'react';
import styled from 'styled-components';
import { Divider, Message, Slider, Checkbox, Dropdown, Button, Select, NumberInput } from 'oskari-ui';
import { ColorPicker } from 'oskari-ui/components/ColorPicker';
import PropTypes from 'prop-types';
import { BUNDLE_KEY } from '../../constants.js';

const FONTS = [
    {
        label: 'Arial (sans-serif)',
        value: 'arial'
    },
    {
        label: 'Georgia (serif)',
        value: 'georgia'
    },
    {
        label: 'Fantasy (sans-serif)',
        value: 'fantasy'
    },
    {
        label: 'Verdana (sans-serif)',
        value: 'verdana'
    }
];

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

export const LayoutForm = ({ mapTheme, infoBoxPreviewVisible, presets, controller }) => {
    const { font = FONTS[0].value, color = {}, navigation = {}, infobox = {} } = mapTheme;
    const [buttonRounding, setButtonRounding] = useState(navigation.roundness);

    return (
        <Content>
            <Field>
                <Dropdown items={presets}>
                    <Button>
                        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.presets' />
                    </Button>
                </Dropdown>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.fonts.label' />
                <StyledSelect
                    value={font}
                    onChange={val => controller.updateTheme('font', val) }
                    options={FONTS} />
            </Field>
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.buttons' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonBackgroundColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={navigation.color?.primary}
                        onChange={val => controller.updateTheme('navigation.color.primary', val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={navigation.color?.text}
                        onChange={val => controller.updateTheme('navigation.color.text', val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonAccentColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={navigation.color?.accent}
                        onChange={val => controller.updateThemeMultiPath(['color.accent', 'navigation.color.accent'], val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.buttonRounding' />
                <ButtonRounding>
                    <SliderContainer>
                        <Slider noMargin
                            value={buttonRounding}
                            onChange={val => setButtonRounding(val)}
                            onChangeComplete={val => controller.updateTheme('navigation.roundness', val)}/>
                    </SliderContainer>
                    <NumberInputContainer>
                        <StyledNumberInput
                            min={0}
                            max={100}
                            value={buttonRounding}
                            onChange={val => controller.updateTheme('navigation.roundness', val)}/>
                        <NumberSuffix>
                            %
                        </NumberSuffix>
                    </NumberInputContainer>
                </ButtonRounding>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.effect' />
                <Checkbox
                    checked={navigation.effect === '3D'}
                    onChange={e => controller.updateTheme('navigation.effect', e.target.checked ? '3D' : undefined)}>
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.3d' />
                </Checkbox>
            </Field>
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.popup' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.popupHeaderColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={color.header?.bg}
                        onChange={val => controller.updateTheme('color.header.bg', val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.popupHeaderTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={color.header?.text}
                        onChange={val => controller.updateThemeMultiPath(['color.header.text', 'color.header.icon'], val)}
                    />
                </StyledColorPicker>
            </Field>
            <Divider><Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.title.infobox' /></Divider>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxHeaderColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={infobox.header?.bg}
                        onChange={val => controller.updateTheme('infobox.header.bg', val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxHeaderTextColor' />
                <StyledColorPicker>
                    <ColorPicker
                        value={infobox.header?.text}
                        onChange={val => controller.updateTheme('infobox.header.bg', val)}
                    />
                </StyledColorPicker>
            </Field>
            <Field>
                <Checkbox checked={infoBoxPreviewVisible} onChange={ () => controller.updateInfoBoxPreviewVisible(!infoBoxPreviewVisible) }>
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.layout.fields.infoboxPreview'/>
                </Checkbox>
            </Field>
        </Content>
    );
};

LayoutForm.propTypes = {
    mapTheme: PropTypes.object.isRequired,
    presets: PropTypes.array.isRequired,
    infoBoxPreviewVisible: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
