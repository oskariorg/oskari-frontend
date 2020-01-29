import React from 'react';
import PropTypes from 'prop-types';
import { Row, ColFixed, Col } from './styled';
import { SpeedSelect } from './SpeedSelect';
import { Input } from './Input';
import { TimeSlider } from './TimeSlider';

const timeIcon = 'clock-circle';

export const TimeControl = props => {
    const { isMobile, changeHandler, timeValue, sliderTimeValue, playing, playHandler, speedHandler, speed } = props;
    if (isMobile) {
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <Input iconType={timeIcon} value={timeValue} changeHandler={changeHandler}/>
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
                <Input iconType={timeIcon} value={timeValue} changeHandler={changeHandler}/>
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
