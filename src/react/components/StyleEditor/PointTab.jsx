import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from '../ColorPicker';
import { Message } from '../Message';
import { FormItem } from '../Form';
import { SvgRadioButton, SizeControl, PreviewCol, constants } from './index';
import { Row, Col } from 'antd';

export const PointTab = ({ oskariStyle, showPreview }) => {
    return (
        <React.Fragment>
            <Row>
                <Col span={ 16 }>
                    <FormItem
                        { ...constants.ANTD_FORMLAYOUT }
                        name='image.fill.color'
                        label={ <Message messageKey='StyleEditor.image.fill.color' /> }
                    >
                        <ColorPicker />
                    </FormItem>
                </Col>
                { showPreview && <PreviewCol oskariStyle={ oskariStyle } format='point' /> }
            </Row>

            <Row>
                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='image.shape'
                    label={ <Message messageKey='StyleEditor.image.shape' /> }
                >
                    <SvgRadioButton options={ Oskari.custom.getSvgIcons() } />
                </FormItem>
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