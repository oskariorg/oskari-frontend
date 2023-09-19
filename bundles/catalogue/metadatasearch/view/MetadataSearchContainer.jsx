import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
import { SearchInput, Spin, Message } from 'oskari-ui';
import { AdvancedSearchContainer } from './advanced-search/AdvancedSearchContainer';
import { MetadataSearchResultListContainer } from './resultlist/MetadataSearchResultListContainer';
import { FlexRowCentered } from './advanced-search/AdvancedSearchStyledComponents';

const Description = () => {
    return <Message bundleKey={METADATA_BUNDLE_LOCALIZATION_ID} messageKey='metadataSearchDescription'/>;
};

const SearchContainer = (props) => {
    const { query, onChange, onSearch } = props;
    return <div>
        <SearchInput
            value={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'placeholder')}
            onSearch={onSearch}/>
    </div>;
};

SearchContainer.propTypes = {
    query: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};

const Container = ({ state, controller }) => {
    const { query,
        advancedSearchExpanded,
        advancedSearchOptions,
        advancedSearchValues,
        loading,
        searchResultsVisible,
        searchResults,
        searchResultsFilter,
        displayedCoverageId,
        drawing,
        selectedLayers } = state;
    return <div>
        { loading && <FlexRowCentered><Spin/></FlexRowCentered>}
        {
            !(loading || searchResultsVisible) &&
            <>
                <Description/>
                <SearchContainer query={query} onChange={controller.updateQuery} onSearch={controller.doSearch}/>
                <AdvancedSearchContainer
                    isExpanded={advancedSearchExpanded}
                    toggleAdvancedSearch={controller.toggleAdvancedSearch}
                    advancedSearchOptions={advancedSearchOptions}
                    advancedSearchValues={advancedSearchValues}
                    controller={controller}
                    drawing={drawing}/>
            </>
        }
        {
            (!loading && searchResultsVisible) &&
            <>
                <MetadataSearchResultListContainer
                    searchResults={searchResults}
                    searchResultsFilter={searchResultsFilter}
                    displayedCoverageId={displayedCoverageId}
                    toggleSearch={controller.toggleSearch}
                    toggleSearchResultsFilter={controller.toggleSearchResultsFilter}
                    showMetadata={controller.showMetadata}
                    toggleCoverageArea={controller.toggleCoverageArea}
                    selectedLayers={selectedLayers}
                    toggleLayerVisibility={controller.toggleLayerVisibility}/>
            </>
        }
    </div>;
};

Container.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object,
    advancedSearchOptions: PropTypes.object
};

export const MetadataSearchContainer = ({ state, controller }) => {
    return <Container state={state} controller={controller}/>;
};

MetadataSearchContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
