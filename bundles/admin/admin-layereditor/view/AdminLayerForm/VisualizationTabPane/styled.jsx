
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
