import React from 'react';
import PropTypes from 'prop-types';
import { LayerFilter } from './LayerFilters/LayerFilter';
import styled from 'styled-components';

const StyledFilters = styled.div`
    margin: 10px;
    color: #949494;
    display: flex;
`;

export const LayerFilters = ({ filters, service }) => {
    const mappedFilters = [];

    if (filters) {
        Object.values(filters).forEach(button => {
            mappedFilters.push(
                <LayerFilter key={button.id} text={button.text}
                    tooltip={button.tooltip} filterName = {button.id}
                    currentStyle = {button.cls.current}
                    clickHandler={(event) => {
                        const filterName = event.target.attributes.filtername || event.target.parentElement.attributes.filtername;
                        service.setCurrentFilter(filterName.value);
                    }}>
                </LayerFilter>
            );
        });
    }
    return (
        <StyledFilters>
            {mappedFilters}
        </StyledFilters>
    );
};

LayerFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};
