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
    height: 40px;
    text-align: center;
`;

export const StyledButton = styled(Button)`
    background: #ffd400;
    color: #3c3c3c;
    width: 100%;
    height: 40px;
    border: 0;
    &:focus,
    &:active,
    &:hover {
        background: #ecb900;
        color: #3c3c3c;
        border: 0;
    }
`;

const StyledSlider = styled(Slider)`
    .ant-slider-mark {
        top: -21px;
    }
    .ant-slider-dot {
        background: #3c3c3c;
        border-radius: 0%;
        border: 0;
        margin-left: 0px;
        width: 2px;
    }
    .ant-slider-dot:last-child {
        margin-left: 0px;
    }
    .ant-slider-track {
        background: #ffd400;
    }
    .ant-slider-handle {
        width: 8px;
        height: 16px;
        border-radius: 6px;
        border: solid 1px #3c3c3c;
        background-color: #ffd400;
        &:focus,
        &:active,
        &:hover {
            border: solid 1px #3c3c3c !important;
            background-color: #ffd400 !important;
        }
        &:focus .ant-slider-track,
        &:active .ant-slider-track,
        &:hover .ant-slider-track {
            background: #ecb900 !important;
        }
    }
    &:hover .ant-slider-track {
        background: #ecb900 !important;
    }
    &:hover .ant-slider-handle {
        border: solid 1px #3c3c3c !important;
        background-color: #ffd400 !important;
    }
`;

export const StyledTimeSlider = styled(StyledSlider)`
    width: 100%;
`;

export const StyledDateSlider = styled(StyledSlider)`
    width: 93%;
`;

export const StyledSelect = styled(Select)``;

export const ColFixed = styled.div`
    flex: 0 0 65%;
    width: auto;
    max-width: 100%;
    position: relative;
`;

export const Border = styled('div')`
    border-radius: 4px;
    border: 1px solid #949494;
    width: 80%;
    padding: 20px 15px 8px 15px;
`;

export const StyledPlayButton = styled(Button)`
    padding: 0;
    border: 0;
    background: #ffd400;
    height: 42px;
    width: 40px;
    fill: #3c3c3c;
    &:focus,
    &:active,
    &:hover {
        background: #ecb900;
        fill: #3c3c3c;
        border: 0;
    }
`;
