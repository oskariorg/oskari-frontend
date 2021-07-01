import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, Preview, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';

const areaFills = [
    {
        name: 'null',
        data: '<svg viewBox="0 0 0 0" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="null" viewBox="0, 0, 0, 0" width="0%" height="0%"><path d="M0,0 l0,0" stroke="#000000" stroke-width="0"/></pattern></defs><rect width="0" height="0" fill="url(#null)"/></svg>' 
    },
    {
        name: 'solid',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="solid" viewBox="0, 0, 4, 4" width="100%" height="100%"><path d="M-1,2 l6,0" stroke="#000000" stroke-width="4"/></pattern></defs><rect width="32" height="32" fill="url(#solid)"/></svg>' 
    },
    {
        name: 'line',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line" viewBox="0, 0, 4, 4" width="50%" height="50%"> <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/></pattern></defs><rect width="32" height="32" fill="url(#line)"/></svg>'
    },
    {
        name: 'line2',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line2" viewBox="0, 0, 4, 4" width="80%" height="80%"><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/></pattern></defs><rect width="32" height="32" fill="url(#line2)"/></svg>'
    },
    {
        name: 'line3',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line3" viewBox="0, 0, 32, 32" width="100%" height="100%"> <path d="M0,4 l32,0, M0,12 l32,0 M0,20 l32,0 M0,28 l32,0" stroke="#000000" stroke-width="5"/></pattern></defs><rect width="32" height="32" fill="url(#line3)"/></svg>'
    },
    {
        name: 'line4',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line4" viewBox="0, 0, 32, 32" width="100%" height="100%"> <path d="M0,4 l32,0, M0,15 l32,0 M0,26 l32,0" stroke="#000000" stroke-width="5"/></pattern></defs><rect width="32" height="32" fill="url(#line4)"/></svg>'
    }
];

export const AreaTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 10 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.area.color'
                        label={ <Message messageKey='StyleEditor.stroke.area.color' /> }
                        >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.area.color'
                    >
                        <SvgRadioButton options={ constants.PRE_DEFINED_COLORS } />
                    </Form.Item>
                </Col>

                <Col span={ 10 } offset={ 2 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='fill.color'
                        label={ <Message messageKey='StyleEditor.fill.color' /> }
                        >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='fill.color'
                    >
                        <SvgRadioButton options={ constants.PRE_DEFINED_COLORS } />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.area.lineDash'
                    label={ <Message messageKey='StyleEditor.stroke.area.lineDash' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.lineDash } />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='fill.area.pattern'
                    label={ <Message messageKey='StyleEditor.fill.area.pattern' /> }
                >
                    <SvgRadioButton options={ areaFills } />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    format={ 'area' }
                    name='stroke.area.width'
                    localeKey={ 'StyleEditor.stroke.area.width' }
                />
            </Row>

            <Preview
                oskariStyle={ props.oskariStyle }
                format={ 'area' }
                areaFills={ areaFills }
            />
        </React.Fragment>
    );
};

AreaTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
