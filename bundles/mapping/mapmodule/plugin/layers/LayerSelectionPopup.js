import React from 'react';
import PropTypes from 'prop-types';
import { showPopup } from 'oskari-ui/components/window';
import { MetadataIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { Checkbox, Message, Radio, Select, Option, Label } from 'oskari-ui';

const BUNDLE_NAME = 'MapModule';

const POPUP_ID = 'LayerSelection';

const THEME_LIGHT = {
    color: {
        primary: '#fffbf3',
        accent: '#ffd622'
    }
};

const THEME_DARK = {
    color: {
        primary: '#47484c',
        accent: '#ffd622'
    }
};

const Content = styled('div')`
    margin: 12px 24px 24px;
`;

const LayerRow = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const RadioGroup = styled(Radio.Group)`
    margin-bottom: 20px;
`;

const StyledCheckbox = styled(Checkbox)`
    margin-right: 5px;
`;

const StyleSelection = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StyledSelect = styled(Select)`
    margin-left: 10px;
`;

const LayerSelectionPopup = ({ baseLayers, layers, showMetadata, styleSelectable, setLayerVisibility, selectStyle }) => {
    const normalLayers = layers.filter(layer => baseLayers.findIndex(bl => bl.getId() === layer.getId()) < 0);
    return (
        <Content>
            <h3><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseDefaultBaseLayer' /></h3>
            <RadioGroup
                value={baseLayers.find(l => l.isVisible())}
                onChange={e => setLayerVisibility(e.target.value, e.target.checked, true)}
            >
                {baseLayers.map(layer => {
                    let styles;
                    let currentStyle;
                    if (styleSelectable) {
                        styles = layer.getStyles();
                        currentStyle = layer.getCurrentStyle() ? layer.getCurrentStyle().getName() : null;
                    }
                    return (
                        <div key={layer.getId()}>
                            <LayerRow>
                                <Radio.Choice value={layer}>
                                    {layer.getName()}
                                </Radio.Choice>
                                {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                            </LayerRow>
                            {styleSelectable && styles && styles.length > 1 && (
                                <StyleSelection>
                                    <Label><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.style' /></Label>
                                    <StyledSelect value={currentStyle} onChange={(s) => selectStyle(layer.getId(), s)} className="t_style">
                                        {styles.map(style => (
                                            <Option key={style.getName()} value={style.getName()}>
                                                {style.getTitle()}
                                            </Option>
                                        ))}
                                    </StyledSelect>
                                </StyleSelection>
                            )}
                        </div>
                    );
                })}
            </RadioGroup>
            <h3><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseOtherLayers' /></h3>
            {normalLayers.map(layer => {
                let styles;
                let currentStyle;
                if (styleSelectable) {
                    styles = layer.getStyles();
                    currentStyle = layer.getCurrentStyle() ? layer.getCurrentStyle().getName() : null;
                }
                return (
                    <div key={layer.getId()}>
                        <LayerRow>
                            <div>
                                <StyledCheckbox
                                    checked={layer.isVisible()}
                                    onChange={e => setLayerVisibility(layer, e.target.checked, false)}
                                />
                                <span>{layer.getName()}</span>
                            </div>
                            {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                        </LayerRow>
                        {styleSelectable && styles && styles.length > 1 && (
                            <StyleSelection>
                                <Label><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.style' /></Label>
                                <StyledSelect value={currentStyle} onChange={(s) => selectStyle(layer.getId(), s)} className="t_style">
                                    {styles.map(style => (
                                        <Option key={style.getName()} value={style.getName()}>
                                            {style.getTitle()}
                                        </Option>
                                    ))}
                                </StyledSelect>
                            </StyleSelection>
                        )}
                    </div>
                );
            })}
        </Content>
    );
};

export const showLayerSelectionPopup = (baseLayers, layers, onClose, showMetadata, styleSelectable, setLayerVisibility, selectStyle, themeConf) => {
    const options = {
        id: POPUP_ID,
        theme: {
            ...themeConf.theme === 'light' ? THEME_LIGHT : THEME_DARK,
            font: themeConf.font
        }
    };

    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
        <LayerSelectionPopup
            baseLayers={baseLayers}
            layers={layers}
            showMetadata={showMetadata}
            styleSelectable={styleSelectable}
            setLayerVisibility={setLayerVisibility}
            selectStyle={selectStyle}
        />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (baseLayerData, layerData, showMetadata, styleSelectable, setLayerVisibility, selectStyle) => controls.update(
            <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
            <LayerSelectionPopup
                baseLayers={baseLayerData}
                layers={layerData}
                showMetadata={showMetadata}
                styleSelectable={styleSelectable}
                setLayerVisibility={setLayerVisibility}
                selectStyle={selectStyle}
            />
        )
    };
};

LayerSelectionPopup.propTypes = {
    baseLayers: PropTypes.arrayOf(PropTypes.object),
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired,
    theme: PropTypes.string,
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired
};
