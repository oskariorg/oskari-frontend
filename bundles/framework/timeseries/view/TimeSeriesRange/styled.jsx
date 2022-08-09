import { Button, NumberInput, Slider } from 'oskari-ui';
import styled from 'styled-components';

const primaryColor = '#ecb900';
const backgroundColor = '#3c3c3c';
const borderColor = '#3c3c3c';

export const Background = styled.div(({ isMobile }) => ({
    minHeight: isMobile ? '120px !important' : '90px !imoprtant',
    width: isMobile ? '260px !important' : '720px !important',
    color: '#ffffff',
    backgroundColor: backgroundColor
}));

export const Header = styled.h3`
    padding: 10px 20px;
    cursor: grab;
    cursor: move;
    display: flex;
    align-items: center;

    .header-mid-spacer {
        flex: 1;
    }
`;

export const IconButton = styled(Button)`
    padding: 10px;
    color: ${primaryColor};

    &:hover,
    &:focus,
    &:active {
        color: ${primaryColor};
    }

    .anticon {
        font-size: 20px;
    }
`;

export const Row = styled.div`
    margin-top: 10px;
    padding: 0 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    text-align: center;
`;

export const Col = styled.div`
    flex-basis: 0;
    max-width: 100%;
    position: relative;

    button {
        background-color: ${primaryColor};
        border-color: ${primaryColor};

        &:hover,
        &:focus,
        &:active {
            background-color: ${primaryColor};
            border-color: ${primaryColor};
        }
    }
`;

export const ColFixed = styled.div`
    flex: 0 0 65%;
    width: auto;
    max-width: 100%;
    position: relative;
    flex-grow: 1;
    padding: 0 20px;
`;

export const YearInput = styled(NumberInput)`
    .ant-input-number-handler-wrap {
        opacity: 1;
    }
`;

const getDataYearStyles = (props) => {
    const { dataYears, marks } = props;
    if (dataYears.length === 0) {
        return '';
    }
    const markYears = Object.keys(marks)
        .map((year) => parseInt(year, 10))
        .sort((a, b) => a - b);

    return dataYears.map((year) => {
        const index = markYears.indexOf(year) + 1;
        return `
            &:nth-child(${index}) {
                border-radius: 50%;
                border: 2px solid #ffffff;
                width: 8px;
                height: 8px;
                margin-left: -2px;
                top: -2px;
                &.ant-slider-dot-active {
                    border: 2px solid ${primaryColor};
                }

                &:hover {
                    :after {
                        content: '${year}';
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-variant: tabular-nums;
                        font-feature-settings: 'tnum';
                        padding-top: 20px;
                    }
                }
            }
        `;
    }).join('');
};

export const StyledRangeSlider = styled(Slider)`
    &&& {
        height: 16px;
    }
    .ant-slider-mark {
        top: -21px;
    }
    .ant-slider-mark-text {
        color: #ffffff;
    }
    .ant-slider-dot {
        background-color: ${backgroundColor};
        border-radius: 0%;
        border: 0;
        margin-left: 0px;
        width: 2px;
        top: 0px;
        height: 4px;
        ${(props) => getDataYearStyles(props)}
    }
    .ant-slider-dot:last-child {
        margin-left: -2px;
    }
    .ant-slider-rail {
        background-color: #ffffff;
    }
    .ant-slider-track {
        background-color: ${primaryColor};
    }
    .ant-slider-handle {
        width: 8px;
        height: 16px;
        border-radius: 6px;
        border: solid 1px ${borderColor};
        background-color: ${primaryColor};
        margin-left: 2px;
        &:focus,
        &:active,
        &:hover {
            border: solid 1px ${borderColor} !important;
            background-color: ${primaryColor} !important;
        }
        &:focus .ant-slider-track,
        &:active .ant-slider-track,
        &:hover .ant-slider-track {
            background-color: ${primaryColor} !important;
        }
    }
    &:hover .ant-slider-track {
        background-color: ${primaryColor} !important;
    }
    &:hover .ant-slider-handle {
        border: solid 1px ${borderColor} !important;
        background-color: ${primaryColor} !important;
    }
`;
