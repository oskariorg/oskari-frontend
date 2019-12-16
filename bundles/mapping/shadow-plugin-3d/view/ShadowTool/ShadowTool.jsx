import React from 'react';
import PropTypes from 'prop-types';
import { Mutator } from 'oskari-ui/util';
import { Background, StyledIcon, Row, Col, StyledInput, StyledButton } from './ShadowToolStyled';

export const ShadowTool = ({ mutator, date, time }) => {
    const [timeValue, setTime] = React.useState(time);
    const [dateValue, setDate] = React.useState(date);
    const setCurrentTime = () => {
        const d = new Date();
        const curTime = `${d.getHours()}:${d.getMinutes()}`;
        const curDate = `${d.getDate()}/${d.getMonth() + 1}`;
        setTime(curTime);
        setDate(curDate);
        mutator.setCurrentTime(curDate, curTime);
    };

    const validateTime = (target) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
        return regex.test(target);
    };

    const validateDate = (target) => {
        const matches = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])[/](0[1-9]|1[0-2]|[1-9])$/.exec(target);
        if (matches === null) {
            return false;
        }
        const d = parseInt(matches[1]);
        const m = matches[2] - 1;
        const dateObject = new Date(2019, m, d);
        return dateObject.getDate() === d && dateObject.getMonth() === m;
    };

    const changeTime = event => {
        const val = event.target.value;
        if (validateTime(val)) {
            mutator.setTime(val);
        }
        setTime(val);
    };

    const changeDate = event => {
        const val = event.target.value;
        if (validateDate(val)) {
            mutator.setDate(val);
        }
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
