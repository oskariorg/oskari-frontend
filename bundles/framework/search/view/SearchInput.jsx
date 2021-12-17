import React from 'react';
import PropTypes from 'prop-types';
import { SearchInput as Input, Message } from 'oskari-ui';
import { getValidationMessageKey } from './SearchHandler';
import { InfoBlock } from './SearchResultInfo';
import { AutoComplete } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import styled from 'styled-components';

/*
The input type="search" has a duplicated "clear" function added by the browser.
The css to hide it was copy/pasted from:
https://blog.maximerouiller.com/post/remove-the-x-from-internet-explorer-and-chrome-input-type-search/

This might go away by updating ant-d. It seems a bit weird that it isn't hidden
*/
const WideAutoComplete = styled(AutoComplete)`
    width: 100%;

    /* clears the 'X' from Internet Explorer */
    input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
    input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }

    /* clears the 'X' from Chrome */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration { display: none; }
`;

const noop = () => {};
const getSuggestionOptions = (suggestions = []) => {
    if (!suggestions.length) {
        return [];
    }
    return [{
        label: (<Message messageKey="autocompleteInfo" />),
        options: suggestions.map(word => ({ value: word }))
    }];
};

export const SearchInput = ({ query = '', suggestions = [], onChange = noop, onSearch = noop, ...rest }) => {
    const validationMsgKey = getValidationMessageKey(query);
    return (
        <React.Fragment>
            <WideAutoComplete
                allowClear={false}
                options={getSuggestionOptions(suggestions)}
                onSelect={onSearch}>
                <Input value={query}
                    className='t_searchInput'
                    { ...rest }
                    size='large'
                    allowClear={true}
                    enterButton={true}
                    onChange={(event) => onChange(event.target.value)}
                    onSearch={onSearch} />
            </WideAutoComplete>
            { validationMsgKey &&
                <InfoBlock>
                    <InfoCircleTwoTone /> <Message messageKey={validationMsgKey} />
                </InfoBlock>}
        </React.Fragment>
    );
};

SearchInput.propTypes = {
    query: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};
