import React from 'react';
import { TextInput, Icon } from 'oskari-ui';
import { Mutator, withLocale } from 'oskari-ui/util';
import PropTypes from 'prop-types';

const Search = React.forwardRef(({ searchText, getMessage, mutator }, ref) => {
    return <TextInput
        ref={ref}
        value={searchText}
        allowClear
        placeholder={getMessage('filter.search.placeholder')}
        prefix={<Icon type="search"/>}
        onChange={event => mutator.setSearchText(event.currentTarget.value)}/>;
});
Search.displayName = 'Search';
Search.propTypes = {
    searchText: PropTypes.string,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    getMessage: PropTypes.func.isRequired
};

const wrapped = withLocale(Search);
export { wrapped as Search };
