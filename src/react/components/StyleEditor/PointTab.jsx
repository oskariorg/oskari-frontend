import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';



export const PointTab = ({ oskariStyle }) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 10 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='image.fill.color'
                        label={ <Message messageKey='StyleEditor.image.fill.color' /> }
                    >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='image.fill.color'
                    >
                        <SvgRadioButton options={ constants.PRE_DEFINED_COLORS } />
                    </Form.Item>
                </Col>

            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='image.shape'
                    label={ <Message messageKey='StyleEditor.image.shape' /> }
                >
                    <SvgRadioButton options={ Oskari.getMarkers() } />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    format={ 'point' }
                    name='image.size'
                    localeKey={ 'StyleEditor.image.size' }
                />
            </Row>
        </React.Fragment>
    );
};

PointTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
