import React from 'react';
import PropTypes from 'prop-types';
import { showPopup } from 'oskari-ui/components/window';
import { MetadataIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { Checkbox, Message, Radio } from 'oskari-ui';

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

const LayerSelectionPopup = ({ baseLayers, layers, showMetadata, setLayerVisibility }) => {
    const normalLayers = layers.filter(layer => baseLayers.findIndex(bl => bl.getId() === layer.getId()) < 0);
    return (
        <Content>
            <h3><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseDefaultBaseLayer' /></h3>
            <RadioGroup
                value={baseLayers.find(l => l.isVisible())}
                onChange={e => setLayerVisibility(e.target.value, e.target.checked, true)}
            >
                {baseLayers.map(layer => {
                    return (
                        <div key={layer.getId()}>
                            <LayerRow>
                                <Radio.Choice value={layer}>
                                    {layer.getName()}
                                </Radio.Choice>
                                {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                            </LayerRow>
                        </div>
                    );
                })}
            </RadioGroup>
            <h3><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseOtherLayers' /></h3>
            {normalLayers.map(layer => {
                return (
                    <LayerRow key={layer.getId()}>
                        <div>
                            <StyledCheckbox
                                checked={layer.isVisible()}
                                onChange={e => setLayerVisibility(layer, e.target.checked, false)}
                            />
                            <span>{layer.getName()}</span>
                        </div>
                        {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                    </LayerRow>
                );
            })}
        </Content>
    );
};

export const showLayerSelectionPopup = (baseLayers, layers, onClose, showMetadata, setLayerVisibility, themeConf) => {
    let font = null;
    if (themeConf.font === 'arial') font = 'Arial, Helvetica, sans-serif';
    if (themeConf.font === 'georgia') font = 'Georgia, Times, "Times New Roman"';

    const options = {
        id: POPUP_ID,
        customTheme: {
            ...themeConf.theme === 'light' ? THEME_LIGHT : THEME_DARK,
            otherStyles: {
                fontFamily: font
            }
        }
    };

    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
        <LayerSelectionPopup baseLayers={baseLayers} layers={layers} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (baseLayerData, layerData, showMetadata, setLayerVisibility) => controls.update(
            <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
            <LayerSelectionPopup baseLayers={baseLayerData} layers={layerData} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />
        )
    };
};

LayerSelectionPopup.propTypes = {
    baseLayers: PropTypes.arrayOf(PropTypes.object),
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired,
    theme: PropTypes.string
};
