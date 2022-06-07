import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from '../ColorPicker';
import { Message } from '../Message';
import { SvgRadioButton, SizeControl, PreviewCol, constants } from './index';
import { Form, Row, Col } from 'antd';

export const PointTab = ({ oskariStyle, showPreview }) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 16 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='image.fill.color'
                        label={ <Message messageKey='StyleEditor.image.fill.color' /> }
                    >
                        <ColorPicker />
                    </Form.Item>
                </Col>
                { showPreview && <PreviewCol oskariStyle={ oskariStyle } format='point' /> }
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
    oskariStyle: PropTypes.object.isRequired,
    showPreview: PropTypes.bool
};