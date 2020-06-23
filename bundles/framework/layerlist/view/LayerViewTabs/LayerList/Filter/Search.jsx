import React from 'react';
import { TextInput } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';

const Search = React.forwardRef(({ searchText, getMessage, controller }, ref) => {
    return <TextInput
        ref={ref}
        value={searchText}
        allowClear
        placeholder={getMessage('filter.search.placeholder')}
        prefix={<SearchOutlined />}
        onChange={event => controller.setSearchText(event.currentTarget.value)}/>;
});
Search.displayName = 'Search';
Search.propTypes = {
    searchText: PropTypes.string,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};

const wrapped = LocaleConsumer(Search);
export { wrapped as Search };
