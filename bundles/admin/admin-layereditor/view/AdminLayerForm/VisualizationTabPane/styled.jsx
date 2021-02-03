
import { Select, Checkbox } from 'oskari-ui';
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

export const InlineBlock = styled('div')`
    padding-left: 10px;
    display: inline-block;
`;

export const Border = styled('div')`
    border: 1px solid #d9d9d9;
    padding: 10px 10px 5px;
    margin: 5px 0px 15px
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
