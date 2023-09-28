import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';
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

// this would make the clear cross be closer to edge:
// padding: 4px 0px 4px 11px;
const StyledInput = styled(TextInput)`
    height: 35px;
    border-radius: calc(${props => props.rounding || 0} * 35px);
`;

const noop = () => {};
const getSuggestionOptions = (suggestions = []) => {
    if (!suggestions.length) {
        return [];
    }
    return [{
        label: (<Message messageKey="plugin.SearchPlugin.autocompleteInfo" bundleKey="MapModule"/>),
        options: suggestions.map(word => ({ value: word }))
    }];
};

export const SearchInput = ({ query = '', suggestions = [], onChange = noop, onSearch = noop, rounding, ...rest }) => {
    // hacky timeout to prevent enter from triggering search with value on the field when we press enter to select from autocomplete
    // without this onEnter gets called before onSelect which triggers the wrong search...
    // autocomplete is intended to be used with AntD Input.Search to make it work with enter properly,
    // but we want to use TextInput instead for styling purposes
    let enterTimeout = null;
    const onSelect = (autocompleteWord) => {
        clearTimeout(enterTimeout);
        onSearch(autocompleteWord);
    };
    const onEnter = () => {
        enterTimeout = setTimeout(onSearch, 100);
    };
    return (
        <React.Fragment>
            <WideAutoComplete
                allowClear={false}
                options={getSuggestionOptions(suggestions)}
                onSelect={onSelect}>
                <StyledInput value={query}
                    rounding={rounding}
                    className='t_searchInput'
                    { ...rest }
                    allowClear={true}
                    onChange={(event) => onChange(event.target.value)}
                    onPressEnter={onEnter} />
            </WideAutoComplete>
        </React.Fragment>
    );
};

SearchInput.propTypes = {
    query: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    rounding: PropTypes.number,
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};
