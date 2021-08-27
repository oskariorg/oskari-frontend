import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, Preview, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';

const getFillIconTransparent = (id) => {
    const myId = 'transparent-' + id;
    return `<svg viewBox="0 0 0 0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="${myId}" viewBox="0, 0, 0, 0" width="0%" height="0%"><path d="M0,0 l0,0" stroke="#000000" stroke-width="0"/></pattern>
        </defs>
        <rect width="0" height="0" fill="url(#${myId})" } />
    </svg>`;
};

const createSVG = (id, pattern) => {
    return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <defs>${pattern}</defs>
        <rect width="32" height="32" fill="url(#${id})" } />
    </svg>`;
};

const getFillIconSolid = (id) => {
    const myId = 'solid-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 4, 4" width="100%" height="100%"><path d="M-1,2 l6,0" stroke="#000000" stroke-width="4"/></pattern>`);
};

const getFillIconHorizontalThin = (id) => {
    const myId = 'thin_horizontal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 32, 32" width="100%" height="100%">
                <path d="M0,4 l32,0, M0,12 l32,0 M0,20 l32,0 M0,28 l32,0" stroke="#000000" stroke-width="5"/>
            </pattern>`);
};

const getFillIconHorizontalThick = (id) => {
    const myId = 'thick_horizontal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 32, 32" width="100%" height="100%">
                <path d="M0,4 l32,0, M0,15 l32,0 M0,26 l32,0" stroke="#000000" stroke-width="5"/>
            </pattern>`);
};

const getFillIconDiagonalThin = (id) => {
    const myId = 'thin_diagonal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 4, 4" width="50%" height="50%">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/>
            </pattern>`);
};

const getFillIconDiagonalThick = (id) => {
    const myId = 'thick_diagonal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 4, 4" width="80%" height="80%">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/>
            </pattern>`);
};

const areaFills = [
    {
        name: 'TRANSPARENT',
        data: getFillIconTransparent
    },
    {
        name: 'SOLID',
        data: getFillIconSolid
    },
    {
        name: 'HORIZONTAL_THIN',
        data: getFillIconHorizontalThin
    },
    {
        name: 'HORIZONTAL_THICK',
        data: getFillIconHorizontalThick
    },
    {
        name: 'DIAGONAL_THIN',
        data: getFillIconDiagonalThin
    },
    {
        name: 'DIAGONAL_THICK',
        data: getFillIconDiagonalThick
    }
];

// counter is used to generate changing ids for SVG to workaround conflicting ids when hard coded
let counter = 0;
export const AreaTab = ({oskariStyle}) => {
    counter++;
    const areaFillOptions = areaFills.map(item => {
        return {
            ...item,
            data: item.data(counter)
    }});

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

            <Preview
                oskariStyle={ oskariStyle }
                format={ 'area' }
                areaFills={ areaFillOptions }
            />

        </React.Fragment>
    );
};


AreaTab.propTypes = {
    oskariStyle: PropTypes.object.isRequired
};
