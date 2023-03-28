import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Radio } from 'oskari-ui';
import { MetadataIcon } from 'oskari-ui/components/icons';
import { StyleSelect } from './StyleSelect';
import { LayerRow } from './LayerList';

const RadioGroup = styled(Radio.Group)`
    margin-bottom: 20px;
`;
const getBaseLayers = (layers) => {
    const baseLayers = [...layers];
    baseLayers.sort(function (a, b) {
        return Oskari.util.naturalSort(a.getName(), b.getName());
    });
    return baseLayers;
}

export const BaseLayerList = ({ layers, showMetadata, styleSelectable, selectLayer, selectStyle, showHeading }) => {
    if (!layers || !layers.length) {
        return null;
    }
    const baseLayers = getBaseLayers(layers);
    const selected = baseLayers.find(l => l.isVisible()) || baseLayers[0];

    return (
        <div className='t_baselayers'>
            { showHeading && <h3><Message messageKey='plugin.LayerSelectionPlugin.chooseDefaultBaseLayer' /></h3> }
            <RadioGroup
                value={selected.getId()}
                onChange={e => selectLayer(baseLayers.find(l => '' + l.getId() === '' + e.target.value))}
            >
                {baseLayers.map(layer => {
                    const isChecked = '' + selected.getId() === '' + layer.getId();
                    return (
                        <div key={layer.getId()} className='t_layer' data-id={layer.getId()} data-checked={isChecked}>
                            <LayerRow>
                                <Radio.Choice value={layer.getId()}>
                                    {layer.getName()}
                                </Radio.Choice>
                                {showMetadata && <MetadataIcon metadataId={layer.getMetadataIdentifier()} />}
                            </LayerRow>
                            {styleSelectable && layer.getStyles().length > 1 && <StyleSelect layer={layer} selectStyle={selectStyle} />}
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
};


BaseLayerList.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    selectLayer: PropTypes.func.isRequired,
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired,
    showHeading: PropTypes.bool
};
