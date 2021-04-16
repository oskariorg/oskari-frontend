
import { Select, Checkbox } from 'oskari-ui';
import styled from 'styled-components';
export { StyledFormField, Border } from '../styled';

const Column = styled('div')`
    float: left;
    overflow: hidden;
`;

export const StyledColumn = {
    Left: styled(Column)`width: 75%;`,
    Right: styled(Column)`width: 25%;`
};

export const InlineBlock = styled('div')`
    padding-left: 10px;
    display: inline-block;
`;

export const StyleField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
`;

export const DefaultStyle = styled(Checkbox)`
    margin-left: 10px;
`;

export const StyleSelect = styled(Select)`
    flex: 1;
`;
