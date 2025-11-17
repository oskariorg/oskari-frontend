import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select } from 'oskari-ui';

const SelectContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const LegendSelect = ({ legends, selected, onChange }) => {
    const count = legends.length;
    if (count === 0) {
        return (
            <Message messageKey='noLegendsText' />
        );
    }

    if (count === 1) {
        return (
            <Message messageKey='singleLegend' />
        );
    }

    return (
        <SelectContainer>
            <Message messageKey='infotext' />
            <Select
                value={selected}
                onChange={onChange}
                className="t_legends"
                options={
                    legends.map(l => ({ 'value': l.id, 'data-value': l.id, 'label': l.title }))
                }
            />
        </SelectContainer>
    );
};

LegendSelect.propTypes = {
    legends: PropTypes.array.isRequired,
    selected: PropTypes.any,
    onChange: PropTypes.func.isRequired
};
