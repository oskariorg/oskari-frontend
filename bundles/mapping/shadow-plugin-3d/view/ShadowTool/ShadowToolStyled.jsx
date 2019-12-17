import styled from 'styled-components';
import { Icon, Button, Slider, Select } from 'oskari-ui';

export const Background = styled.div`
    background-color: #3c3c3c;
    min-height: 90px;
    width: 720px;
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
    text-align: center;
`;

export const StyledButton = styled(Button)`
    background: #ffd400;
    color: #3c3c3c;
    width: 100%;
    height: 30px;
    border: 0;
    &:focus,
    &:active,
    &:hover {
        background: #ecb900;
        color: #3c3c3c;
        border: 0;
    }
`;

export const StyledSlider = styled(Slider)`
    .ant-slider-mark {
        top: -21px;
    }
`;

export const StyledSelect = styled(Select)``;

export const ColFixed = styled.div`
    flex: 0 0 55%;
    width: auto;
    max-width: 100%;
    position: relative;
`;

export const Border = styled('div')`
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    width: 90%;
    padding: 10px 15px;
`;

export const StyledPlayButton = styled('button')`
    padding: 0;
    border: 0;
    background: #ffd400;
    height: 40px;
    width: 40px;
`;
