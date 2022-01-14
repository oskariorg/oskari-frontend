import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';
import { getAreaPattern } from './Preview/SVGHelper';

const getFillSVG = (name, counter) => {
    const myId = name.toLowerCase() + '-' + counter;
    const patternDef = getAreaPattern(myId, name, '#000000');
    // TODO
    let fillPattern = `url(#${myId})`;
    if (name === 'TRANSPARENT') {
        fillPattern = 'none';
    } else if (name === 'SOLID') {
        fillPattern = '#000000'
    }
    return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            ${patternDef}
        <rect width="32" height="32" fill="${fillPattern}" />
    </svg>`;
};

const areaFills = ['TRANSPARENT', 'SOLID', 'HORIZONTAL_THIN', 'HORIZONTAL_THICK', 'DIAGONAL_THIN', 'DIAGONAL_THICK'];

const getFillOptions = () => {
    return areaFills.map(name => {
        return {
            name,
            data: getFillSVG(name, counter)
        };
    });

};

// counter is used to generate changing ids for SVG to workaround conflicting ids when hard coded
let counter = 0;
export const AreaTab = ({oskariStyle}) => {
    counter++;
    const areaFillOptions = getFillOptions();

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
                <SizeControl
                    format={ 'area' }
                    name='stroke.area.width'
                    localeKey={ 'StyleEditor.stroke.area.width' }
                />
            </Row>
        </React.Fragment>
    );
};


AreaTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
