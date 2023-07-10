import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { PropTypes } from 'prop-types';
import { ActionLinkContainer, FlexRight, FlexRow } from './MetadataSearchResultListStyledComponents';
import { MetadataSearchResultList } from './MetadataSearchResultList';

const SEARCH_RESULT_FILTER_TYPES = {
    datasets: ['dataset', 'series'],
    services: ['service']
};

export const MetadataSearchResultListContainer = (props) => {
    const { searchResults, toggleSearch, toggleSearchResultsFilter, searchResultsFilter, showMetadata, toggleCoverageArea, displayedCoverageId } = props;
    const searchResultsFiltered = searchResultsFilter ? searchResults.filter((item) => searchResultsFilter.includes(item.natureofthetarget)) : searchResults;
    return <>
        <FlexRow>
            <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.resultTitle')}</div>
            <FlexRight>
                { searchResultsFilter &&
                    <ActionLinkContainer>
                        <a onClick={() => toggleSearchResultsFilter(null)}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showSearch')}</a>
                    </ActionLinkContainer>
                }
                {
                    !searchResultsFilter &&
                        <>
                            <ActionLinkContainer>
                                <a onClick={() => toggleSearchResultsFilter(SEARCH_RESULT_FILTER_TYPES.datasets)}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showDatasets')}</a>
                            </ActionLinkContainer>
                            <ActionLinkContainer>
                                <a onClick={() => toggleSearchResultsFilter(SEARCH_RESULT_FILTER_TYPES.services)}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showServices')}</a>
                            </ActionLinkContainer>
                        </>
                }
                <ActionLinkContainer>
                    <a onClick={toggleSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.modifySearch')}</a>
                </ActionLinkContainer>
            </FlexRight>
        </FlexRow>
        <MetadataSearchResultList
            searchResults={searchResultsFiltered}
            showMetadata={showMetadata}
            toggleCoverageArea={toggleCoverageArea}
            displayedCoverageId={displayedCoverageId}/>
    </>;
};

MetadataSearchResultListContainer.propTypes = {
    searchResults: PropTypes.array,
    toggleSearch: PropTypes.func,
    toggleSearchResultsFilter: PropTypes.func,
    searchResultsFilter: PropTypes.array,
    showMetadata: PropTypes.func,
    toggleCoverageArea: PropTypes.func,
    displayedCoverageId: PropTypes.string
};
