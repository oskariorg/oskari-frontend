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
