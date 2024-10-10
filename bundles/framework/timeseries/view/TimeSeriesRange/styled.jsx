import { NumberInput } from 'oskari-ui';
import styled from 'styled-components';

const bgColor = '#3c3c3c';

export const Background = styled.div(({ isMobile, textColor, backgroundColor }) => ({
    'minHeight': isMobile ? '120px !important' : '90px !important',
    'width': isMobile ? '260px !important' : '720px !important',
    'color': textColor || '#ffffff',
    'background-color': backgroundColor || bgColor
}));

export const Header = styled.h3`
    padding: 10px 20px;
    cursor: grab;
    cursor: move;
    display: flex;
    align-items: center;
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
