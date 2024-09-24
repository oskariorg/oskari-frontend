import React from 'react';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
import { SearchInput, Spin, Message } from 'oskari-ui';
import { AdvancedSearchContainer } from './advanced-search/AdvancedSearchContainer';
import { MetadataSearchResultListContainer } from './resultlist/MetadataSearchResultListContainer';
import { FlexRowCentered } from './advanced-search/AdvancedSearchStyledComponents';
import styled from 'styled-components';

const DescriptionContainer = styled('div')`
    margin-bottom: 8px;
`;

const Description = () => {
    return <DescriptionContainer>
        <Message bundleKey={METADATA_BUNDLE_LOCALIZATION_ID} messageKey='metadataSearchDescription'/>
    </DescriptionContainer>;
};

const SearchContainer = (props) => {
    const { query, onChange, onSearch, disabled } = props;
    return <div>
        <SearchInput
            disabled={disabled}
            enterButton={true}
            size='large'
            value={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'placeholder')}
            onSearch={onSearch}/>
    </div>;
};

SearchContainer.propTypes = {
    query: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    disabled: PropTypes.bool
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

    if (loading) {
        return (
            <FlexRowCentered>
                <Spin/>
            </FlexRowCentered>
        );
    }

    if (searchResultsVisible) {
        return <MetadataSearchResultListContainer
            searchResults={searchResults}
            searchResultsFilter={searchResultsFilter}
            displayedCoverageId={displayedCoverageId}
            toggleSearch={controller.toggleSearch}
            toggleSearchResultsFilter={controller.toggleSearchResultsFilter}
            showMetadata={controller.showMetadata}
            toggleCoverageArea={controller.toggleCoverageArea}
            selectedLayers={selectedLayers}
            toggleLayerVisibility={controller.toggleLayerVisibility}/>;
    }

    return (
        <div>
            <Description/>
            <SearchContainer
                disabled={drawing}
                query={query}
                onChange={controller.updateQuery}
                onSearch={controller.doSearch}/>
            <AdvancedSearchContainer
                isExpanded={advancedSearchExpanded}
                toggleAdvancedSearch={controller.toggleAdvancedSearch}
                advancedSearchOptions={advancedSearchOptions}
                advancedSearchValues={advancedSearchValues}
                controller={controller}
                drawing={drawing}/>
        </div>
    );
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
