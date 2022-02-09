import styled from 'styled-components';

export { PrimaryButton } from './PrimaryButton';
export { SecondaryButton } from './SecondaryButton';

export const ButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    margin-top: 10px;
    button {
        margin-left: 5px;
    }
`;
