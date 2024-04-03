import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InactiveLegend } from './legend/InactiveLegend';
import { LegendRow } from './legend/LegendRow';

const Container = styled.div`
    margin: 0 auto;
    width: 90%;
    overflow: hidden;
`;

export const Legend = ({
    transparency = 100,
    mapStyle,
    classifiedData
}) => {
    const { error } = classifiedData;
    if (error) {
        const errorKey = error === 'general' ? 'cannotCreateLegend' : error;
        return (<InactiveLegend error = {errorKey} />);
    }
    const opacity = transparency / 100;
    const { groups } = classifiedData;
    const maxSizePx = groups.map(g => g.sizePx).reduce((max, val) => max < val ? val : max);
    return (
        <Container>
            { groups.map((group, i) =>
                <LegendRow key={`item-${i}`}
                    opacity={opacity}
                    mapStyle={mapStyle}
                    maxSizePx={maxSizePx}
                    { ...group }
                />
            )}
        </Container>
    );
};

Legend.propTypes = {
    transparency: PropTypes.number,
    mapStyle: PropTypes.string.isRequired,
    classifiedData: PropTypes.object.isRequired
};
