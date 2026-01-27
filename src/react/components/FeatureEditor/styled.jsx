import React from 'react';
import { Space } from 'oskari-ui';
import styled from 'styled-components';

export const StyledSpace = styled(Space)`
    width: 100%;
`;

export const StyledContainer = styled('div')`
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`;
export const StyledModIndicator = styled('span')`
    color: orange;
`;

export const Column = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 1em;  zdx
`;

export const Row = styled('div')`
    display: flex;
    flex-direction: row;
    gap: 1em;
`;