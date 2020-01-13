import styled from 'styled-components';

export const InlineFlex = styled('div')`
    display: flex;
    align-items: center;
    > * {
        flex: 1;
    }
    ${({ lockFirstChild }) => {
        if (lockFirstChild) {
            return `
            > :first-child {
                flex: 0;
                margin-right: 10px;
            }`;
        }
    }}
`;
