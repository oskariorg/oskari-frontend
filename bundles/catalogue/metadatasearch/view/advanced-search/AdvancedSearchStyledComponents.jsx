import styled from 'styled-components';
import { Select } from 'oskari-ui';

export const AdvancedSearchRowContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: flex-start
`;

export const AdvancedSearchInputLabel = styled('label')`
    margin-right: 1em;
`;

export const AdvancedSearchSelect = styled(Select)`
    width: 25em;
`;
