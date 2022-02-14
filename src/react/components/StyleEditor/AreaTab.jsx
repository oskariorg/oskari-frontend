import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message, Tooltip } from 'oskari-ui';
import { SvgRadioButton, SizeControl, constants, PreviewCol } from './index';
import { Form, Row, Col } from 'antd';
import { FillPattern, isSolid } from './FillPattern';

const { FILLS } = constants;
const SIZE = 32;
const COLOR = '#000000';
const ID_PREFIX = 'pattern-';

const getFillIcon = (name, fillCode) => {
    const id = ID_PREFIX + name.toLowerCase();
    const solid = isSolid(fillCode);
    const fillPattern = solid ? COLOR : `url(#${id})`;
    return (
        <svg width={SIZE} height={SIZE}>
            { !solid && <FillPattern id={id} fillCode={fillCode} color={COLOR}/> }
            <rect width={SIZE} height={SIZE} fill={fillPattern} />
        </svg>
    );
};

let fillOtions;
const getFillOptions = () => {
    if (!fillOtions) {
        fillOtions = Object.keys(FILLS).map(name  => {
            const fillCode = FILLS[name];
            return {
                name: fillCode,
                data: getFillIcon(name, fillCode)
            };
        });
    }
    return fillOtions;
};

export const AreaTab = ({oskariStyle, showPreview}) => {
    const areaFillOptions = getFillOptions();
    return (
        <React.Fragment>
            <Row>
                <Col span={ 12 }>
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.area.color'
                        label={ <Message messageKey='StyleEditor.stroke.area.color' /> }
                        >
                        <ColorPicker />
                    </Form.Item>
                </Col>

                <Col span={ 12 } >
                    <Form.Item
                        { ...constants.ANTD_FORMLAYOUT }
                        name='fill.color'
                        label={ <Message messageKey='StyleEditor.fill.color' /> }
                        >
                        <ColorPicker />
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
                    name='stroke.area.lineJoin'
                    label={ <Message messageKey='StyleEditor.stroke.area.lineJoin' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.corners } />
                </Form.Item>

                <Form.Item
                    { ...constants.ANTD_FORMLAYOUT }
                    name='fill.area.pattern'
                    label={ <Message messageKey='StyleEditor.fill.area.pattern' /> }
                >
                    <SvgRadioButton options={ areaFillOptions } />
                </Form.Item>
            </Row>

            <Row>
                <Col span={ 16 }>
                    <SizeControl
                        format={ 'area' }
                        name='stroke.area.width'
                        localeKey={ 'StyleEditor.stroke.area.width' }
                    />
                </Col>
                { showPreview && <PreviewCol oskariStyle={ oskariStyle } format='area' /> }
            </Row>
        </React.Fragment>
    );
};


AreaTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    showPreview: PropTypes.bool
};
