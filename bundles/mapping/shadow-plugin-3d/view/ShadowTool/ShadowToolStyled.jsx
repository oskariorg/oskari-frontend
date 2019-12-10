import styled from 'styled-components';
import { Icon, Button } from 'oskari-ui';

export const Background = styled.div`
    background-color: #3c3c3c;
    min-height: 90px;
    width: 250px;
    padding: 20px;
    margin: -10px;
`;

export const StyledIcon = styled(Icon)`
    margin-right: 15px;
`;

export const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    flex-wrap: wrap;
`;

export const Col = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
`;

export const StyledInput = styled.input`
    border-radius: 2px;
    box-shadow: inset 0.5px 0.5px 1.5px 0 rgba(0, 0, 0, 0.5);
    width: 60px;
    border: none;
    height: 30px;
`;

export const StyledButton = styled(Button)`
    background: #ffd400;
    color: #000;
    width: 100%;
    height: 30px;
`;
