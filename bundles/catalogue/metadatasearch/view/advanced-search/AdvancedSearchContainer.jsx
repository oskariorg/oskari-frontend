import React from 'react';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { AdvancedSearchOptions } from './AdvancedSearchOptions';
import styled from 'styled-components';

const ContainerWithMargin = styled('div')`
    margin-top: 1em;
`;

export const AdvancedSearchContainer = (props) => {
    const { isExpanded, toggleAdvancedSearch, advancedSearchOptions, advancedSearchValues, drawing, controller } = props;
    return (<ContainerWithMargin>
        { !isExpanded && <a onClick={toggleAdvancedSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.showMore')}</a>}
        { isExpanded &&
            <div>
                <a onClick={toggleAdvancedSearch}>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.showLess')}</a>
                <AdvancedSearchOptions
                    advancedSearchOptions={advancedSearchOptions}
                    advancedSearchValues={advancedSearchValues}
                    controller={controller}
                    drawing={drawing}/>
            </div>
        }
    </ContainerWithMargin>);
};

AdvancedSearchContainer.propTypes = {
    isExpanded: PropTypes.bool,
    toggleAdvancedSearch: PropTypes.func,
    advancedSearchOptions: PropTypes.object,
    advancedSearchValues: PropTypes.object,
    coverageFeature: PropTypes.object,
    drawing: PropTypes.bool,
    controller: PropTypes.object
};
