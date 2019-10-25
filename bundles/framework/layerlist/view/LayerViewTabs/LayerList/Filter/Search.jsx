import React from 'react';
import { TextInput, Icon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import PropTypes from 'prop-types';

export const Search = ({ searchText, locale, mutator }) =>
    <div>
        <TextInput
            value={searchText}
            autoFocus
            allowClear
            placeholder={locale.filter.search.placeholder}
            prefix={<Icon type="search"/>}
            onChange={event => mutator.setSearchText(event.currentTarget.value)}/>
    </div>;

Search.propTypes = {
    searchText: PropTypes.string,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
