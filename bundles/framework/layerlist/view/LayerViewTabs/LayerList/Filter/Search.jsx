import React from 'react';
import { TextInput, Tooltip, Icon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputHolder = styled('div')`
    display: flex;
    align-items: center;
    flex: 1 1 200px;
    > :not(:last-child) {
        margin-right: 5px;
    }
`;

const InfoIcon = styled(Icon)`
    color: rgba(0,0,0,.45);
    font-size: 22px;
`;

const Info = ({ infoText }) =>
    <Tooltip title={infoText}>
        <InfoIcon type="question-circle" />
    </Tooltip>;

Info.propTypes = {
    infoText: PropTypes.string.isRequired
};

export const Search = ({ searchText, locale, mutator }) =>
    <InputHolder>
        <TextInput
            value={searchText}
            autoFocus
            allowClear
            placeholder={locale.text}
            prefix={<Icon type="search"/>}
            onChange={event => mutator.setSearchText(event.currentTarget.value)}/>
        <Info infoText={locale.description} size="large"/>
    </InputHolder>;

Search.propTypes = {
    searchText: PropTypes.string,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
