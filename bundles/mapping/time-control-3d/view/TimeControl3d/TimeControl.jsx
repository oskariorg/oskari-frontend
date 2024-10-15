import React from 'react';
import PropTypes from 'prop-types';
import { Row, ColFixed, Col, ClockIcon } from './styled';
import { SpeedSelect } from './SpeedSelect';
import { Input } from './Input';
import { TimeSlider } from './TimeSlider';

export const TimeControl = ({ isMobile, changeHandler, timeValue, sliderTimeValue, playing, playHandler, speedHandler, speed }) => {
    if (isMobile) {
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <Input value={timeValue} changeHandler={changeHandler}><ClockIcon /></Input>
                    </Col>
                    <Col>
                        <SpeedSelect speedHandler={speedHandler} speed={speed}/>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <TimeSlider
                        isMobile = {isMobile}
                        changeHandler = {changeHandler}
                        sliderTimeValue = {sliderTimeValue}
                        playing = {playing}
                        playHandler = {playHandler}
                    ></TimeSlider>
                </Row>
            </div>
        );
    }
    return (
        <Row style={{ marginTop: '5px' }}>
            <Col>
                <Input value={timeValue} changeHandler={changeHandler}><ClockIcon /></Input>
            </Col>
            <ColFixed>
                <TimeSlider
                    isMobile = {isMobile}
                    changeHandler = {changeHandler}
                    sliderTimeValue = {sliderTimeValue}
                    playing = {playing}
                    playHandler = {playHandler}
                ></TimeSlider>
            </ColFixed>
            <Col>
                <SpeedSelect speedHandler={speedHandler} speed={speed}/>
            </Col>
        </Row>
    );
};

TimeControl.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    timeValue: PropTypes.string.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired,
    speedHandler: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired
};
