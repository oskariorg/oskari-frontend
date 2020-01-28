import React from 'react';
import PropTypes from 'prop-types';
import { Row, ColFixed, Col } from './ShadowToolStyled';
import { Speed } from './Speed';
import { Input } from './Input';
import { TimeSlider } from './TimeSlider';

export const ShadowToolTime = props => {
    const { isMobile, changeHandler, timeValue, sliderTimeValue, playing, playHandler, speedHandler, speed } = props;
    if (isMobile) {
        return (
            <div>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <Input timeValue ={timeValue} changeHandler ={changeHandler}></Input>
                    </Col>
                    <Col>
                        <Speed speedHandler={speedHandler} speed={speed}></Speed>
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
                <Input timeValue ={timeValue} changeHandler ={changeHandler}></Input>
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
                <Speed speedHandler={speedHandler} speed={speed}></Speed>
            </Col>
        </Row>
    );
};

ShadowToolTime.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    timeValue: PropTypes.string.isRequired,
    sliderTimeValue: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
    playHandler: PropTypes.func.isRequired,
    speedHandler: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired
};
