import React from 'react';
import styled from 'styled-components';

const StyledIcon = styled.div`
    font-weight: bold;
    font-family: Open Sans,Arial,sans-serif;
`;

export const TextIcon = ({iconSize, text, style={} }) => {
    const modifiedStyle = iconSize ? { ...style, fontSize: iconSize } : style;
    return (
        <StyledIcon style={modifiedStyle}>
            {text}
        </StyledIcon>
    );
};
