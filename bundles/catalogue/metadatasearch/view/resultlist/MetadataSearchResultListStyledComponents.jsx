import styled from 'styled-components';
import { Switch } from 'oskari-ui';
export const FlexRow = styled('div')`
    display: flex;
    flex-direction: row;
`;

export const SearchResultRow = styled('div')`
    display: flex;
    flex-direction: row;
    padding: 1em;
    margin: 0.25em;
    border: 1px solid grey;
    font-size: smaller;
    font-size: smaller;
`;

export const ClickableDiv = styled('div')`
    cursor: pointer;
`;

export const FlexColumn = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const FlexRight = styled('div')`
    margin-left: auto;
    display: flex;
    flex-direction: row;
`;

export const ActionLinkContainer = styled('div')`
    margin: auto 0.25em auto 0;
`;

export const SearchResultLayerListContainer = styled('div')`
    margin-left: 0.25em;
`;

export const SearchResultLayerListItem = styled('div')`
    margin: 0.25em 0;
`;

export const LayerListSwitch = styled(Switch)`
    margin-right: 0.5em;
`;
