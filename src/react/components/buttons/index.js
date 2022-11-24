import styled from 'styled-components';

export { PrimaryButton } from './PrimaryButton';
export { SecondaryButton } from './SecondaryButton';
export { DeleteButton } from './DeleteButton';
export { IconButton } from './IconButton';
export { MapButton } from './MapButton';
export { Toolbar } from './ToolbarButton';
export { ToolbarButtonItem } from './ToolbarButton';

export const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    margin-top: 10px;
    button {
        margin-left: 5px;
    }
`;
