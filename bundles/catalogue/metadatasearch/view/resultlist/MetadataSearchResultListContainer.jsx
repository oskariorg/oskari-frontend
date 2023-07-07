import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { PropTypes } from 'prop-types';
import { FlexRight, FlexRow } from './MetadataSearchResultListStyledComponents';
import { MetadataSearchResultList } from './MetadataSearchResultList';

export const MetadataSearchResultListContainer = (props) => {
    const { searchResults, toggleSearch } = props;
    return <>
        <FlexRow>
            <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.resultTitle')}</div>
            <FlexRight>
                <a onClick={toggleSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.modifySearch')}</a>
            </FlexRight>
        </FlexRow>
        <MetadataSearchResultList searchResults={searchResults}/>
    </>;
};

MetadataSearchResultListContainer.propTypes = {
    searchResults: PropTypes.array,
    toggleSearch: PropTypes.func
};
