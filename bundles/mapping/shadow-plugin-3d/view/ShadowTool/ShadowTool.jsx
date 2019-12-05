import React from 'react';
import styled from 'styled-components';
import { Icon, Button } from 'oskari-ui';

const Background = styled.div`
    background-color: #3c3c3c;
    min-height: 90px;
    width: 250px;
    padding: 20px;
    margin: -10px;
`;

const StyledIcon = styled(Icon)`
    margin-right: 15px;
`;

const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const Col = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
`;

const StyledInput = styled.input`
    border-radius: 2px;
    box-shadow: inset 0.5px 0.5px 1.5px 0 rgba(0, 0, 0, 0.5);
    width: 60px;
    border: none;
    height: 30px;
`;

const StyledButton = styled(Button)`
    background: #ffd400;
    color: #000;
    width: 100%;
    height: 30px;
`;

export const ShadowTool = () => {
    const [time, setTime] = React.useState('12:00');
    const [date, setDate] = React.useState('01/06');
    const setCurrentTime = () => {
        const date = new Date();
        setTime(`${date.getHours()}:${date.getMinutes()}`);
        setDate(`${date.getDate()}/${date.getMonth() + 1}`);
    };
    return (
        <Background>
            <Row>
                <Col>
                    <StyledIcon type="calendar" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={date} onChange={setDate} />
                </Col>
                <Col>
                    <StyledButton onClick={setCurrentTime}>Nykyhetki</StyledButton>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <StyledIcon type="clock-circle" style={{ color: '#d9d9d9', fontSize: '18px' }} />
                    <StyledInput value={time} onChange={setTime} />
                </Col>
            </Row>
        </Background>
    );
};
