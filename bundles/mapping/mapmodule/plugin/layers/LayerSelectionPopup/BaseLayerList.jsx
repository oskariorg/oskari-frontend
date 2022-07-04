import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Radio } from 'oskari-ui';
import { StyleSelect } from './StyleSelect';
import { LayerRow } from './LayerList';

const RadioGroup = styled(Radio.Group)`
    margin-bottom: 20px;
`;

export const BaseLayerList = ({ layers, showMetadata, styleSelectable, selectLayer, selectStyle }) => {
    if (!layers || !layers.length) {
        return null;
    }
    const selected = layers.find(l => l.isVisible()) || layers[0];
    return (
        <React.Fragment>
            <h3><Message messageKey='plugin.LayerSelectionPlugin.chooseDefaultBaseLayer' /></h3>
            <RadioGroup
                value={selected.getId()}
                onChange={e => selectLayer(layers.find(l => '' + l.getId() === '' + e.target.value))}
            >
                {layers.map(layer => {
                    return (
                        <div key={layer.getId()}>
                            <LayerRow>
                                <Radio.Choice value={layer.getId()}>
                                    {layer.getName()}
                                </Radio.Choice>
                                {showMetadata && <MetadataIcon metadataId={layer.getMetadataIdentifier()} />}
                            </LayerRow>
                            {styleSelectable && <StyleSelect layer={layer} selectStyle={selectStyle} />}
                        </div>
                    );
                })}
            </RadioGroup>
        </React.Fragment>
    );
};


BaseLayerList.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    selectLayer: PropTypes.func.isRequired,
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired
};
