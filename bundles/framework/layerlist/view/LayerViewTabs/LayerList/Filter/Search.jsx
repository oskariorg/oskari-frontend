import React from 'react';
import { TextInput, Icon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import PropTypes from 'prop-types';

const handleChange = (event, mutator) => {
    event.stopPropagation();
    mutator.setSearchText(event.currentTarget.value);
};

export const Search = React.forwardRef(({ searchText, locale, mutator }, ref) => {
    return <TextInput
        ref={ref}
        value={searchText}
        allowClear
        placeholder={locale.filter.search.placeholder}
        prefix={<Icon type="search"/>}
        onChange={event => handleChange(event, mutator)}/>;
});
Search.displayName = 'Search';
Search.propTypes = {
    searchText: PropTypes.string,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
