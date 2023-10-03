import styled from 'styled-components';
import { Select } from 'oskari-ui';

export const AdvancedSearchRowContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 0.25em;
`;

export const FlexColumnContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const FlexRowCentered = styled('div')`
    display: flex;
    justify-content: center;
`;

export const AdvancedSearchInputLabel = styled('label')`
    margin-right: 1em;
    max-width: 10em;
    width: 10em;
`;

export const AdvancedSearchSelect = styled(Select)`
    width: 25em;
`;

export const AdvancedSearchCheckboxGroupContainer = styled('div')`
    max-width: 45em;
    display: inline-block;

`;
