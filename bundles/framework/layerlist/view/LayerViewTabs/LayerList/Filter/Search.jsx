import React from 'react';
import { TextInput, Icon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import PropTypes from 'prop-types';

export const Search = React.forwardRef(({ searchText, locale, mutator }, ref) => {
    return <TextInput
        ref={ref}
        value={searchText}
        allowClear
        placeholder={locale.filter.search.placeholder}
        prefix={<Icon type="search"/>}
        onChange={event => mutator.setSearchText(event.currentTarget.value)}/>;
});
Search.displayName = 'Search';
Search.propTypes = {
    searchText: PropTypes.string,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
