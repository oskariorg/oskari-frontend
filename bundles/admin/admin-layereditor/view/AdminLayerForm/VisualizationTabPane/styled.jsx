
import styled from 'styled-components';

export { StyledFormField } from '../styled';

const Column = styled('div')`
    float: left;
    overflow: hidden;
`;

export const StyledColumn = {
    Left: styled(Column)`width: 75%;`,
    Right: styled(Column)`width: 25%;`
};

export const Link = styled('a')`
    margin-left: 10px;
`;

export const LegendLink = styled('a')`
    clear: both;
    line-break: anywhere;
`;

export const Border = styled('div')`
    border:1px solid #d9d9d9;
    padding: 10px 10px 5px;
    margin: 5px 0px 15px
`;
