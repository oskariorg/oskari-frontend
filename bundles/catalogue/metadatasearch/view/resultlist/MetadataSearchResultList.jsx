import React from 'react';
import { FlexRow } from './MetadataSearchResultListStyledComponents';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { MetadataSearchResultListItem } from './MetadataSearchResultListItem';
import { PropTypes } from 'prop-types';

export const MetadataSearchResultList = (props) => {
    const { searchResults, showMetadata, toggleCoverageArea, displayedCoverageId } = props;
    const hasSearchResults = (searchResults && searchResults.length);

    return <>
        {
            !hasSearchResults &&
                <FlexRow>
                    <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.noSearchResults')}</div>
                </FlexRow>
        }
        {
            hasSearchResults && searchResults
                .map((result) =>
                    <MetadataSearchResultListItem
                        key={result.id}
                        item={result}
                        showMetadata={showMetadata}
                        toggleCoverageArea={toggleCoverageArea}
                        displayedCoverageId={displayedCoverageId}
                    />)
        }
    </>;
};

MetadataSearchResultList.propTypes = {
    searchResults: PropTypes.array,
    showMetadata: PropTypes.func,
    toggleCoverageArea: PropTypes.func,
    displayedCoverageId: PropTypes.string
};
