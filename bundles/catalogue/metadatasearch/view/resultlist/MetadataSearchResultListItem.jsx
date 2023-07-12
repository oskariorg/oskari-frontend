import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { ClickableDiv, FlexColumn, FlexRight, LayerListSwitch, SearchResultLayerListContainer, SearchResultLayerListItem, SearchResultRow } from './MetadataSearchResultListStyledComponents';
import { CoverageIcon } from './CoverageIcon';
import { PropTypes } from 'prop-types';

export const MetadataSearchResultListItem = (props) => {
    const { item,
        showMetadata,
        toggleCoverageArea,
        toggleLayerVisibility,
        displayedCoverageId,
        selectedLayers } = props;

    const identificationCode = item?.identification?.code ? Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.identificationCode.' + item.identification.code) : null;
    const identificationDate = item?.identification?.date ? item.identification.date : null;

    return <SearchResultRow>
        <FlexColumn>
            <ClickableDiv title={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'grid.info')} onClick={() => showMetadata(item.id)}>
                <span>{item.name}, {item.organization} </span>
                { identificationCode && identificationDate &&
                    <span>({identificationCode}:{identificationDate})</span>
                }
            </ClickableDiv>
            {
                !!item?.layers?.length &&
                    <SearchResultLayerListContainer>
                        { item.layers.map((layer) =>
                            <SearchResultLayerListItem key={layer.getId()}>
                                <LayerListSwitch size = 'small' checked={layer.isVisible() && isSelected(layer, selectedLayers)} onChange={(event) => toggleLayerVisibility(event, layer.getId())}/>
                                <span>{layer.getName()}</span>
                            </SearchResultLayerListItem>
                        )}
                    </SearchResultLayerListContainer>
            }
        </FlexColumn>
        <FlexRight>
            { item.geom && <CoverageIcon active={displayedCoverageId === item.id} item={item} toggleCoverageArea={toggleCoverageArea}/> }
        </FlexRight>
    </SearchResultRow>;
};

const isSelected = (layer, selectedLayers) => {
    return !!selectedLayers?.find(selectedLayer => selectedLayer.getId() === layer.getId());
};

MetadataSearchResultListItem.propTypes = {
    item: PropTypes.object,
    showMetadata: PropTypes.func,
    toggleCoverageArea: PropTypes.func,
    toggleLayerVisibility: PropTypes.func,
    displayedCoverageId: PropTypes.string,
    selectedLayers: PropTypes.array
};
