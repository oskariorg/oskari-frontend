import React from 'react';
import PropTypes from 'prop-types';
import { SearchInput as Input } from 'oskari-ui';
import { AutoComplete } from 'antd';
import styled from 'styled-components';

const WideAutoComplete = styled(AutoComplete)`
    width: 100%;
`;

const noop = () => {};

export const SearchInput = ({ query = '', suggestions = [], onChange = noop, onSearch = noop, ...rest }) => {
    const input = (
        <Input value={query}
            className='searchInput'
            { ...rest }
            size='large'
            // autocomplete/large setting will show it's own clear option
            allowClear={false}
            enterButton={true}
            onChange={(event) => onChange(event.target.value)}
            onSearch={onSearch} />);
    if (!suggestions && !suggestions.length) {
        return input;
    }
    return (<WideAutoComplete
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
