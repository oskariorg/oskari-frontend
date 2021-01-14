import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, Preview, SizeControl, constants } from './index';
import { Form, Row } from 'antd';

export const LineTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.color'
                    label={ <Message messageKey='VisualizationForm.line.color.label' /> }
                >
                    <ColorPicker
                        defaultValue={ props.oskariStyle.stroke.color } />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineDash'
                    label={ <Message messageKey='VisualizationForm.line.style.label' /> }
                >
                    <SvgRadioButton
                        options={ constants.LINE_STYLES.lineDash }
                        defaultValue={ props.oskariStyle.stroke.lineDash }
                    />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineCap'
                    label={ <Message messageKey='VisualizationForm.line.cap.label' /> }
                >
                    <SvgRadioButton
                        options={ constants.LINE_STYLES.linecaps }
                        defaultValue={ props.oskariStyle.stroke.lineCap }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.area.lineJoin'
                    label={ <Message messageKey='VisualizationForm.line.corner.label' /> }
                >
                    <SvgRadioButton
                        options={ constants.LINE_STYLES.corners }
                        defaultValue={ props.oskariStyle.stroke.area.lineJoin }
                    />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    format={ 'line' }
                    name='stroke.width'
                />
            </Row>

            <Preview
                styleSettings={ props.oskariStyle }
                format={ 'line' }
            />

        </React.Fragment>
    );
};

LineTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
