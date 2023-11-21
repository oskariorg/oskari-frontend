import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { PropTypes } from 'prop-types';
import { ActionLinkContainer, FlexRight, FlexRow } from './MetadataSearchResultListStyledComponents';
import { MetadataSearchResultList } from './MetadataSearchResultList';
import { Select } from 'oskari-ui';
import styled from 'styled-components';

const SEARCH_RESULT_FILTER_TYPES = {
    all: null,
    datasets: ['dataset', 'series'],
    services: ['service']
};

const StyledSelect = styled(Select)`
    min-width: 15em;
`;

const SearchResultTitle = styled('div')`
    margin: auto 1em auto 0;
`;

export const MetadataSearchResultListContainer = (props) => {
    const options = [{
        label: Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showSearch'),
        value: 'all'
    }, {
        label: Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showDatasets'),
        value: 'datasets'
    }, {
        label: Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.showServices'),
        value: 'services'
    }];

    const { searchResults,
        toggleSearch,
        toggleSearchResultsFilter,
        searchResultsFilter,
        showMetadata,
        toggleCoverageArea,
        displayedCoverageId,
        selectedLayers,
        toggleLayerVisibility } = props;

    const searchResultsFiltered = searchResultsFilter && searchResultsFilter.length ? searchResults.filter((item) => searchResultsFilter.includes(item.natureofthetarget)) : searchResults;
    const hasSearchResults = !!(searchResults && searchResults.length);
    return <>
        <FlexRow>
            <SearchResultTitle>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.resultTitle')}</SearchResultTitle>
            <FlexRight>
                { hasSearchResults && <ActionLinkContainer>
                    <StyledSelect options={options} onChange={(value) => toggleSearchResultsFilter(SEARCH_RESULT_FILTER_TYPES[value])} defaultValue={'all'}/>
                </ActionLinkContainer>
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
            displayedCoverageId={displayedCoverageId}
            selectedLayers={selectedLayers}
            toggleLayerVisibility={toggleLayerVisibility}/>
    </>;
};

MetadataSearchResultListContainer.propTypes = {
    searchResults: PropTypes.array,
    toggleSearch: PropTypes.func,
    toggleSearchResultsFilter: PropTypes.func,
    searchResultsFilter: PropTypes.array,
    showMetadata: PropTypes.func,
    toggleCoverageArea: PropTypes.func,
    displayedCoverageId: PropTypes.string,
    selectedLayers: PropTypes.array,
    toggleLayerVisibility: PropTypes.func
};
