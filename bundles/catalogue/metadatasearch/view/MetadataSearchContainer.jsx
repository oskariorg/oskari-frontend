import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
import { SearchInput } from 'oskari-ui';
import { AdvancedSearchContainer } from './AdvancedSearchContainer';
const Description = () => {
    return <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'metadataSearchDescription')}</div>;
};

const SearchContainer = (props) => {
    const { query, onChange } = props;
    return <div>
        <SearchInput
            query={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'placeholder')}/>
    </div>;
};

SearchContainer.propTypes = {
    query: PropTypes.string,
    onChange: PropTypes.func
};

const MetadataSearchContainer = ({ state, controller }) => {
    const { query, advancedSearchExpanded } = state;
    return <div>
        <Description/>
        <SearchContainer query={query} onChange={controller.updateQuery} />
        <AdvancedSearchContainer isExpanded={advancedSearchExpanded} toggleAdvancedSearch={controller.toggleAdvancedSearch}/>
    </div>;
};

MetadataSearchContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};

export const renderMetadataSearchContainer = (state, controller, element) => {
    const render = (state, controller) => {
        ReactDOM.render(<MetadataSearchContainer state = { state } controller = { controller }/>, element);
    };

    render(state, controller);
    return {
        update: render
    };
};
