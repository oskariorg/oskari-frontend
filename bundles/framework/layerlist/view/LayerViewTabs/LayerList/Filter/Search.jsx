import React from 'react';
import { TextInput, Tooltip, Icon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const FlexBox = styled('div')`
    display: flex;
    align-items: center;
    > :not(:last-child) {
        margin-right: 15px;
    }
`;

const SearchInput = styled(TextInput)`
    flex: 1 1 500px;
`;

const InfoIcon = styled(Icon)`
    color: #979797;
    font-size: 20px;
    flex: 0 0 30px;
`;

export const Search = ({ searchText, locale, mutator }) =>
    <FlexBox>
        <SearchInput
            value={searchText}
            autoFocus
            allowClear
            placeholder={locale.filter.search.placeholder}
            prefix={<Icon type="search"/>}
            onChange={event => mutator.setSearchText(event.currentTarget.value)}/>
        <Tooltip title={locale.filter.search.tooltip}>
            <InfoIcon type="question-circle" />
        </Tooltip>
    </FlexBox>;

Search.propTypes = {
    searchText: PropTypes.string,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
