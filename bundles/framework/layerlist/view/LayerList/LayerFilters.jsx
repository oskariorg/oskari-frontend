import React from 'react';
import PropTypes from 'prop-types';
import { LayerFilter } from './LayerFilters/LayerFilter';
import { TextInput, Tooltip, Icon } from 'oskari-ui';
import styled from 'styled-components';

const StyledFilters = styled.div`
    margin: 10px;
    color: #949494;
    display: flex;
`;

export const LayerFilters = ({ filters, locale, mutator }) => {
    const mappedFilters = [];
    const getTextSearchSuffix = () => (
        <Tooltip title={locale.description}>
            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
    );

    if (filters) {
        Object.values(filters).forEach(button => {
            mappedFilters.push(
                <LayerFilter key={button.id} text={button.text}
                    tooltip={button.tooltip} filterName = {button.id}
                    currentStyle = {button.cls.current}
                    clickHandler={(event) => {
                        const filterName = event.currentTarget.attributes.filtername;
                        mutator.setActiveFilterId(filterName.value);
                    }}>
                </LayerFilter>
            );
        });
    }
    return (
        <React.Fragment>
            <StyledFilters>
                {mappedFilters}
            </StyledFilters>
            <TextInput placeholder={locale.text} suffix={getTextSearchSuffix()} />
        </React.Fragment>
    );
};

LayerFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired
};
