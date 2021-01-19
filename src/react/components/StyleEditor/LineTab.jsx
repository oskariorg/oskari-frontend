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
                    label={ <Message messageKey='StyleEditor.line.color' /> }
                >
                    <ColorPicker
                        defaultValue={ props.oskariStyle.stroke.color } />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineDash'
                    label={ <Message messageKey='StyleEditor.line.style' /> }
                >
                    <SvgRadioButton
                        options={ constants.LINE_STYLES.lineDash }
                        defaultValue={ props.oskariStyle.stroke.lineDash }
                    />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineCap'
                    label={ <Message messageKey='StyleEditor.line.cap' /> }
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
                    label={ <Message messageKey='StyleEditor.line.corner' /> }
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
                    localeKey={ 'StyleEditor.line.width' }
                />
            </Row>

            <Preview
                oskariStyle={ props.oskariStyle }
                format={ 'line' }
            />

        </React.Fragment>
    );
};

LineTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
