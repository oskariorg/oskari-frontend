import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, SizeControl, Preview, constants } from './index';
import { Form, Row, Col } from 'antd';



const PreviewCol = ({ oskariStyle }) => {
    return (
        <Col span={ 8 }>
            <Preview
                oskariStyle={ oskariStyle }
                format={ 'point' }
                style={{ border: '1px solid #d9d9d9' }}
            />
        </Col>
    );
};

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
                { showPreview && <PreviewCol oskariStyle={ oskariStyle }/> }
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