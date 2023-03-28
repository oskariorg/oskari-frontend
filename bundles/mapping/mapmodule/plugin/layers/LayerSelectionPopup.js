import React from 'react';
import PropTypes from 'prop-types';
import { showPopup } from 'oskari-ui/components/window';
import { BaseLayerList } from './LayerSelectionPopup/BaseLayerList';
import { LayerList } from './LayerSelectionPopup/LayerList';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { getPopupOptions } from '../pluginPopupHelper';
import styled from 'styled-components';

const BUNDLE_NAME = 'MapModule';

const POPUP_ID = 'LayerSelection';

const Content = styled('div')`
    margin: 12px 24px 24px;
`;

const LayerSelectionPopup = ({ baseLayers, layers, showMetadata, styleSelectable, setLayerVisibility, selectStyle }) => {
    const selectBaseLayer = (layer) => setLayerVisibility(layer, true, true);
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <Content>
                <BaseLayerList
                    layers={baseLayers}
                    showHeading={layers && layers.length > 0}
                    showMetadata={showMetadata}
                    styleSelectable={styleSelectable}
                    selectLayer={selectBaseLayer}
                    selectStyle={selectStyle} />
                <LayerList
                    layers={layers}
                    showHeading={baseLayers && baseLayers.length > 0}
                    showMetadata={showMetadata}
                    styleSelectable={styleSelectable}
                    setLayerVisibility={setLayerVisibility}
                    selectStyle={selectStyle} />
            </Content>
        </LocaleProvider>
    );
};

export const showLayerSelectionPopup = (baseLayers, layers, onClose, showMetadata, styleSelectable, setLayerVisibility, selectStyle, pluginLocation) => {
    const options = getPopupOptions({
        getName: () => POPUP_ID,
        getLocation: () => pluginLocation
    });

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
        update: (baseLayerData, layerData, showMetadata, styleSelectable) => controls.update(
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
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired
};
