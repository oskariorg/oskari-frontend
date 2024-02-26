import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, Message } from 'oskari-ui';
import { MetadataIcon } from 'oskari-ui/components/icons';
import { StyleSelect } from './StyleSelect';

export const LayerRow = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const LayerList = ({ layers, showMetadata, styleSelectable, setLayerVisibility, selectStyle, showHeading }) => {
    if (!layers || !layers.length) {
        return null;
    }

    return (
        <div className='t_otherlayers'>
            { showHeading && <h3><Message messageKey='plugin.LayerSelectionPlugin.chooseOtherLayers' /></h3> }
            { layers.map(layer => {
                return (
                    <div key={layer.getId()} className='t_layer' data-id={layer.getId()} data-checked={layer.isVisible()}>
                        <LayerRow>
                            <Checkbox
                                checked={layer.isVisible()}
                                value={layer.getId()}
                                onChange={e => setLayerVisibility(layer, e.target.checked, false)}
                                >{layer.getName()}</Checkbox>
                            {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} metadataUrl={layer.getAttributes().metadataUrl || null} />)}
                        </LayerRow>
                            {layer.isVisible() && styleSelectable && layer.getStyles().length > 1 && <StyleSelect layer={layer} selectStyle={selectStyle} />}
                    </div>
                );
            })}
        </div>
    );
};

LayerList.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired,
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired,
    showHeading: PropTypes.bool
};
