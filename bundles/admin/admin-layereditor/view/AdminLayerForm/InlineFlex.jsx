import styled from 'styled-components';

const growLastChildStyle = `
> :last-child {
    flex: 1;
}
> :not(:last-child) {
    flex: 0;
    margin-right: 10px;
}`;

const growAllChildrenStyle = `
> * {
    flex: 1;
}`;

export const InlineFlex = styled('div')`
    display: flex;
    align-items: center;
    ${({ growLastChild }) => growLastChild ? growLastChildStyle : growAllChildrenStyle}
`;
