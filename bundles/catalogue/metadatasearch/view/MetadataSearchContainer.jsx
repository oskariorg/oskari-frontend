import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
import { SearchInput, Spin } from 'oskari-ui';
import { AdvancedSearchContainer } from './advanced-search/AdvancedSearchContainer';
import { MetadataSearchResultListContainer } from './resultlist/MetadataSearchResultListContainer';
import { FlexRowCentered } from './advanced-search/AdvancedSearchStyledComponents';

const Description = () => {
    return <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'metadataSearchDescription')}</div>;
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

const MetadataSearchContainer = ({ state, controller }) => {
    const { query, advancedSearchExpanded, advancedSearchOptions, advancedSearchValues, loading, searchResultsVisible, searchResults, searchResultsFilter, displayedCoverageId } = state;
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
                    controller={controller}/>
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
                    toggleCoverageArea={controller.toggleCoverageArea}/>
            </>
        }
    </div>;
};

MetadataSearchContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object,
    advancedSearchOptions: PropTypes.object
};

export const renderMetadataSearchContainer = (state, controller, element) => {
    const render = (state, controller) => {
        ReactDOM.render(<MetadataSearchContainer state={state} controller={controller} />, element);
    };

    render(state, controller);
    return {
        update: render
    };
};
