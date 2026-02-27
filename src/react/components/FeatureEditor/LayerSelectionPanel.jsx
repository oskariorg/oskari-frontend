import React, { useState } from 'react';
import { Select, Button, Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { MY_FEATURES_LAYER_TYPE } from '../../../../bundles/framework/myfeatures/constants';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
    min-width: 75%;
`;

const Row = styled('div')`
    display: flex;
    justify-content: flex-start;
    gap: 1em;
    padding-bottom: 1em;
`;

const BUNDLE_KEY = 'oskariui';

export const LayerSelectionPanel = ({ setCurrentLayer, addNewLayer = null }) => {
    const [selectedLayer, setSelectedLayer] = useState(null);

    const myFeaturesLayers = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService')?.getLayersOfType(MY_FEATURES_LAYER_TYPE) || [];
    const options = myFeaturesLayers?.map((layer) => {
        return {
            value: layer.getId(),
            label: layer.getName()
        }
    });


    const updateCurrentLayer = () => {
        //const mapLayer =
        setCurrentLayer(selectedLayer);
    };

    return <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
        <Row>
            <b><Message messageKey='FeatureEditorView.setCurrentLayerTitle'/></b>
        </Row>
        <Row>
            <StyledSelect options={options} value={selectedLayer} onChange={(value) => {
                setSelectedLayer(value);
            }}/>
        </Row>
        <Row>
            <Button disabled={!selectedLayer} type='primary' onClick={() => { updateCurrentLayer(); }}>
                <Message messageKey='FeatureEditorView.buttons.setCurrentLayer'/>
            </Button>
            {
                addNewLayer &&
                <Button type='primary' onClick={() => { addNewLayer(); }}>
                    <Message messageKey='FeatureEditorView.buttons.addNewLayer'/>
                </Button>
            }

        </Row>
    </LocaleProvider>;
};