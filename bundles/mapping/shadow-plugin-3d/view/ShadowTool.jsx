import React from 'react';
import styled from 'styled-components';
import { Icon, TimePicker, DatePicker } from 'oskari-ui';
import moment from 'moment';

const Background = styled.div`
    background-color: #3c3c3c;
    border-radius: 5px;
    height: 150px;
    width: 250px;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 16px;
    color: #fff;
`;

const StyledIcon = styled(Icon)`
    margin-right: 15px;
`;

export const ShadowPlugin = () => {
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };
    const format = 'HH:mm';
    return (
        <Background>
            <Title>Varjostus</Title>
            <StyledIcon type="calendar" style={{ color: '#d9d9d9', fontSize: '18px' }} />
            <DatePicker defaultValue={moment('06-06', 'MM-DD')} onChange={onChange} /><br/>
            <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
            <TimePicker defaultValue={moment('12:08', format)} format={format} />
        </Background>
    );
};
