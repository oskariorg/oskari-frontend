import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Centered = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const PointPreview = ({ imageDef }) => {
    const { src, scale } = Oskari.custom.getSvg(imageDef);
    const size = Oskari.custom.SVG_SIZE * scale;
    return (
        <Centered>
            <img src={src} width={size} height={size} />
        </Centered>
    );
};

PointPreview.propTypes = {
    imageDef: PropTypes.object.isRequired
};
