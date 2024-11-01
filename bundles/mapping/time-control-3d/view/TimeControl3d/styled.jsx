import styled from 'styled-components';
import { ThemedButton, Select } from 'oskari-ui';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

export const CalendarIcon = styled(CalendarOutlined)`
    margin-right: 15px;
    color: #d9d9d9;
    font-size: 18px;
`;

export const ClockIcon = styled(ClockCircleOutlined)`
    margin-right: 15px;
    color: #d9d9d9;
    font-size: 18px;
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
    width: 70px;
    border: none;
    height: 38px;
    font-size: 16px;
    text-align: center;
`;

export const StyledButton = styled(ThemedButton)`
    font-size: 16px;
    width: 100%;
    height: 40px;
`;

export const StyledPlayButton = styled(ThemedButton)`
    font-size: 16px;
    padding: 0;
    height: 42px;
    width: 40px;
`;

export const DateSliderContainer = styled.div`
    width: 93%;
    margin-top: 20px;
`;

export const StyledSelect = styled(Select)`
    &&&{
        color: #000000;
        text-align: center;
    }
    width: 100%;
    .ant-select-selection {
        background-color: #595959;
    }
    .ant-select-selection-item {
        padding-right: 0 !important;
    }
    .ant-select-arrow {
        color: #ffffff;
    }
`;

export const ColFixed = styled.div`
    flex: 0 0 65%;
    width: auto;
    max-width: 100%;
    position: relative;
`;
export const Divider = styled.div`
    margin-bottom: 30px;
`;
export const TimeBorder = styled.div(({ isMobile }) => ({
    borderRadius: '4px',
    border: '1px solid #949494',
    width: isMobile ? '72%' : '80%',
    padding: isMobile ? '12px 15px 8px 15px' : '20px 15px 4px 15px'
}));
