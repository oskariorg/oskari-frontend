import React from 'react';
import PropTypes from 'prop-types';
import { SearchInput as Input } from 'oskari-ui';
//import { AutoComplete } from 'antd';
//const { Option } = AutoComplete;
const noop = () => {};

export const SearchInput = ({ query = '', onChange = noop, onSearch = noop, ...rest }) => {
    return (
        <Input value={query}
            { ...rest }
            allowClear={true}
            enterButton={true}
            onChange={(event) => onChange(event.target.value)}
            onSearch={onSearch} />);
};

SearchInput.propTypes = {
    query: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};
