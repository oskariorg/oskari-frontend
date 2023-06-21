import styled from 'styled-components';
import { TextInput, Label } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Block = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid #999;
    min-height: 50px;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
    font-size: 16px;
    background-color: #F3F3F3;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Button = styled(IconButton)`
    margin-left: 10px;
`;

export const LabelledField = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    align-items: center;
`;

export const StyledLabel = styled(Label)`
    margin-right: 10px;
`;

export const StyledInput = styled(TextInput)`
    width: 210px;
`;
