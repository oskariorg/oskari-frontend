import React from 'react';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
const AdvancedSearchOptions = (props) => {
 return <h1>kiikkikii</h1>;
}

export const AdvancedSearchContainer = (props) => {
    const { isExpanded, toggleAdvancedSearch } = props;
    return (<div>
        { !isExpanded && <a onClick={toggleAdvancedSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'showMore')}</a>}
        { isExpanded &&
            <div>
                <a onClick={toggleAdvancedSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'showLess')}</a>
                <AdvancedSearchOptions />
            </div>
        }
    </div>);
};

AdvancedSearchContainer.propTypes = {
    isExpanded: PropTypes.bool,
    toggleAdvancedSearch: PropTypes.func
};
