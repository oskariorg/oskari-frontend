import React, { useState } from 'react';
import { Select, Button, Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import styled from 'styled-components';
import { BUNDLE_KEY } from '../../constants';
import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'oskari-ui';

const LayerSelectionContainer = styled('div')`
    padding: 1em;
    min-width: 25%;
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

export const LayerSelectionPanel = ({ layers, setCurrentLayer = null, addNewLayer = null }) => {
    const options = layers?.sort((a, b) => a.getName().localeCompare(b.getName())).map((layer) => {
        return {
            value: layer.getId(),
            label: layer.getName()
        };
    });

    const [selectedLayer, setSelectedLayer] = useState(options?.[0]?.value || null);


    const updateCurrentLayer = () => {
        setCurrentLayer(selectedLayer);
    };

    return <LayerSelectionContainer>
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Row>
                <b><Message messageKey='featureEditor.layerSelectionPanel.setCurrentLayerTitle'/></b>
            </Row>
            <Row>
                <StyledSelect options={options} value={selectedLayer} onChange={(value) => {
                    setSelectedLayer(value);
                }}/>
                {
                    addNewLayer &&
                    <Tooltip title={<Message messageKey='featureEditor.layerSelectionPanel.buttons.addNewLayer'/>}>
                        <Button onClick={() => { addNewLayer(); }}><PlusOutlined /></Button>
                    </Tooltip>
                }
            </Row>
            <Row>
                <Button disabled={!selectedLayer} type='primary' onClick={() => { updateCurrentLayer(); }}>
                    <Message messageKey='featureEditor.layerSelectionPanel.buttons.setCurrentLayer'/>
                </Button>
            </Row>
        </LocaleProvider>
    </LayerSelectionContainer>;
};