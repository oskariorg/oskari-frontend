import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { InfoCircleTwoTone } from '@ant-design/icons';

const InfoBlock = styled('div')`
    padding-top: 1em;
    padding-bottom: 0.5em;
`;
export const SearchResultInfo = ({ count = 0, hasMore = false }) => {
    const hasResults = count > 0;
    return (
        <InfoBlock className="info">
            <ResultAmount count={count} hasMore={hasMore} />
            { hasResults &&
                <React.Fragment>
                    <br />
                    <Message messageKey="searchResultDescriptionOrdering" />
                </React.Fragment> }
        </InfoBlock>);
};

const ResultAmount = ({ count = 0, hasMore = false }) => {
    if (count == 0) {
        // twoToneColor="#ffd400"
        return (<React.Fragment>
            <InfoCircleTwoTone /> <Message messageKey="searchservice_search_not_found_anything_text" />
        </React.Fragment>);
    }
    if (hasMore) {
        return (<Message messageKey="searchMoreResults" messageArgs={{ count }}/>);
    }
    return (<Message messageKey="searchResultCount" messageArgs={{ count }}/>);
}

SearchResultInfo.propTypes = {
    count: PropTypes.number,
    hasMore: PropTypes.bool,
};
