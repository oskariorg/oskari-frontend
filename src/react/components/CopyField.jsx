import React from 'react';
import styled from 'styled-components';
import { ThemeProvider, ThemeConsumer } from 'oskari-ui/util';

const StyledField = styled('div')`
    display: block;
    border: 1px dashed rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 5px;
    word-break: break-all;
    -moz-transition: all 0.5s ease-out;
    -o-transition: all 0.5s ease-out;
    -webkit-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
    background-color: #ffffff;
    &.highlight {
        background-color: ${props => props.$highlightColor};
    }
`;

const ThemedField = ThemeConsumer(({ theme, value, highlighted }) => {
    return (
        <StyledField $highlightColor={theme.color.primary} className={highlighted ? 'copy-field highlight' : 'copy-field'}>
            {value}
        </StyledField>
    );
});

export const CopyField = ({ value, highlighted }) => {
    return (
        <ThemeProvider>
            <ThemedField
                value={value}
                highlighted={highlighted}
            />
        </ThemeProvider>
    );
};
