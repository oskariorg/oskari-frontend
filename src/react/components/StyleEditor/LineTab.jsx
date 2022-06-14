import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from '../ColorPicker';
import { Message } from '../Message';
import { SvgRadioButton, SizeControl, constants, PreviewCol } from './index';
import { Row, Col } from 'antd';
import { FormItem } from '../Form';

export const LineTab = ({ oskariStyle, showPreview }) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 16 }>
                    <FormItem
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.color'
                        label={ <Message messageKey='StyleEditor.stroke.color' /> }
                    >
                        <ColorPicker />
                    </FormItem>
                </Col>
                { showPreview && <PreviewCol oskariStyle={ oskariStyle } format='line' /> }
            </Row>

            <Row>
                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineDash'
                    label={ <Message messageKey='StyleEditor.stroke.lineDash' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.lineDash } />
                </FormItem>

                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineCap'
                    label={ <Message messageKey='StyleEditor.stroke.lineCap' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.linecaps } />
                </FormItem>

                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.lineJoin'
                    label={ <Message messageKey='StyleEditor.stroke.lineJoin' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.corners } />
                </FormItem>
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
    oskariStyle: PropTypes.object.isRequired,
    showPreview: PropTypes.bool
};
