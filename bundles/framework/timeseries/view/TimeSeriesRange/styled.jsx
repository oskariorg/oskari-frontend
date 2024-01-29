import { Button, NumberInput } from 'oskari-ui';
import styled from 'styled-components';

const primaryColor = '#ecb900';
const backgroundColor = '#3c3c3c';
const borderColor = '#3c3c3c';
const noDataColor = '#FF0000';

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
    color: ${props => props?.theme ? props?.theme?.map?.navigation?.color?.text : '#ffffff'};
    .header-mid-spacer {
        flex: 1;
    }
`;

export const IconButton = styled(Button)`
    padding: 10px;
    color: ${props => props?.theme ? props?.theme?.map?.navigation?.color?.text : primaryColor};

    &:hover,
    &:focus,
    &:active {
        color: ${props => props?.theme ? props?.theme?.map?.navigation?.color?.accent : primaryColor};
    }

    .anticon {
        font-size: 20px;
    }
`;

export const Row = styled.div`
    margin-top: 10px;
    padding: 0 20px 10px 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
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
`;

export const YearInput = styled(NumberInput)`
    width: 80px;
    .ant-input-number-handler-wrap {
        opacity: 1;
    }
`;
