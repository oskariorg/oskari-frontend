import { Select, Alert, Button } from 'oskari-ui';
import styled from 'styled-components';

export const StyledAlert = styled(Alert)`
    margin-bottom: 5px;
`;

export const StyledButton = styled(Button)`
    margin-right: 5px;
    margin-bottom: 5px;
`;

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    & ${Select} {
        width: 100%;
    }
`;


export const Border = styled('div')`
    border: 1px solid #d9d9d9;
    padding: 10px 10px 5px;
    margin: 5px 0px 15px
`;
