import styled from 'styled-components';

export const StyledRoot = styled('div')`
    padding: 5px;
    max-width: 700px;
`;

export const StyledTab = styled('div')`
& > label {
    font-weight: bold;
}
`;

export const StyledComponentGroup = styled('div')`
    padding-bottom: 10px;
`;

export const StyledComponent = styled('div')`
    padding-top: 5px;
    padding-bottom 10px;
`;

export const StyledColumnLeft = styled('div')`
float:left;
width:75%;
overflow:hidden;
`;

export const StyledColumnRight = styled('div')`
float:left;
width:25%;
overflow:hidden;
`;
