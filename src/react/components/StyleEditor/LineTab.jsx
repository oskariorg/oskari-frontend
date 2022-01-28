import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';

export const LineTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 12 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.color'
                        label={ <Message messageKey='StyleEditor.stroke.color' /> }
                    >
                        <ColorPicker />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineDash'
                    label={ <Message messageKey='StyleEditor.stroke.lineDash' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.lineDash } />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineCap'
                    label={ <Message messageKey='StyleEditor.stroke.lineCap' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.linecaps } />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineJoin'
                    label={ <Message messageKey='StyleEditor.stroke.lineJoin' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.corners } />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    format={ 'line' }
                    name='stroke.width'
                    localeKey={ 'StyleEditor.stroke.width' }
                />
            </Row>
        </React.Fragment>
    );
};

LineTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
