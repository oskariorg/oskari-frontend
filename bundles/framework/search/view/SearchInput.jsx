import React from 'react';
import PropTypes from 'prop-types';
import { SearchInput as Input } from 'oskari-ui';
import { AutoComplete } from 'antd';
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

export const SearchInput = ({ query = '', suggestions = [], onChange = noop, onSearch = noop, ...rest }) => {
    const input = (
        <Input value={query}
            className='t_searchInput'
            { ...rest }
            size='large'
            allowClear={true}
            enterButton={true}
            onChange={(event) => onChange(event.target.value)}
            onSearch={onSearch} />);
    if (!suggestions && !suggestions.length) {
        return input;
    }
    return (<WideAutoComplete
        allowClear={false}
        options={suggestions.map(word => ({ value: word }))}
        onSelect={onSearch}>
            {input}
        </WideAutoComplete>);
};

SearchInput.propTypes = {
    query: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};
