import React from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Background, StyledIcon, Row, Col, StyledInput, StyledButton } from './ShadowToolStyled';

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = React.useState(time);
    const [dateValue, setDate] = React.useState(date);
    const setCurrentTime = () => {
        const date = new Date();
        const curTime = `${date.getHours()}:${date.getMinutes()}`;
        const curDate = `${date.getDate()}/${date.getMonth() + 1}`;
        setTime(curTime);
        setDate(curDate);
        mutator.setCurrentTime(curDate, curTime);
    };
    const changeTime = event => {
        console.log(event.target.value);
        mutator.setTime(event.target.value);
        setTime(event.target.value);
    };
    const changeDate = event => {
        console.log(event.target.value);
        mutator.setDate(event.target.value);
        setDate(event.target.value);
    };
    return (
        <Background>
            <Row>
                <Col>
                    <StyledIcon type="calendar" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={dateValue} onChange={changeDate} />
                </Col>
                <Col>
                    <StyledButton onClick={setCurrentTime}>Nykyhetki</StyledButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={timeValue} onChange={changeTime} />
                </Col>
            </Row>
        </Background>
    );
};

ShadowTool.propTypes = {
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};
