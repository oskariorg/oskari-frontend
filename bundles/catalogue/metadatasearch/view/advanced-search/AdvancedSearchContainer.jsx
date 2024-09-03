import React from 'react';
import PropTypes from 'prop-types';
import { AdvancedSearchOptions } from './AdvancedSearchOptions';
import styled from 'styled-components';
import { Message, Spin } from 'oskari-ui';

const ContainerWithMargin = styled('div')`
    margin-top: 1em;
`;

export const AdvancedSearchContainer = ({
    isExpanded,
    toggleAdvancedSearch,
    advancedSearchOptions,
    advancedSearchValues,
    drawing,
    controller
}) => {
    const { fields = [], loading } = advancedSearchOptions || {};
    if (loading) {
        return <Spin/>;
    }
    if (!fields.length) {
        return null;
    }
    return (
        <ContainerWithMargin>
            <a onClick={toggleAdvancedSearch}>
                <Message messageKey={isExpanded ? 'advancedSearch.showLess' : 'advancedSearch.showMore'} />
            </a>
            { isExpanded && <AdvancedSearchOptions
                advancedSearchOptions={advancedSearchOptions}
                advancedSearchValues={advancedSearchValues}
                controller={controller}
                drawing={drawing}/>
            }
        </ContainerWithMargin>
    );
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
