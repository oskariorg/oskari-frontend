import React, { useState } from 'react';
import { Select, Button, Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import styled from 'styled-components';

const LayerSelectionContainer = styled('div')`
    padding: 1em;
`;

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

export const LayerSelectionPanel = ({ layers, setCurrentLayer = null, addNewLayer = null }) => {
    const [selectedLayer, setSelectedLayer] = useState(null);

    const options = layers?.map((layer) => {
        return {
            value: layer.getId(),
            label: layer.getName()
        }
    });


    const updateCurrentLayer = () => {
        setCurrentLayer(selectedLayer);
    };

    return <LayerSelectionContainer>
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
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
        </LocaleProvider>
    </LayerSelectionContainer>;
};