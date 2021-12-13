import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, SizeControl, constants } from './index';
import { Form, Row, Col } from 'antd';

const getFillIconTransparent = (id) => {
    const myId = 'transparent-' + id;
    return `<svg viewBox="0 0 0 0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="${myId}" viewBox="0, 0, 0, 0" width="0%" height="0%"><path d="M0,0 l0,0" stroke="#000000" stroke-width="0"/></pattern>
        </defs>
        <rect width="0" height="0" fill="url(#${myId})" />
    </svg>`;
};

const createSVG = (id, pattern) => {
    return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <defs>${pattern}</defs>
        <rect width="32" height="32" fill="url(#${id})" />
    </svg>`;
};

const getFillIconSolid = (id) => {
    const myId = 'solid-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 12, 12" width="100%" height="100%"><path d="M-1,6 l13,0" stroke="#000000" stroke-width="12"/></pattern>`);
};

const getFillIconHorizontalThin = (id) => {
    const myId = 'thin_horizontal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 12, 12" width="100%" height="100%">
                <path d="M-1,1 l33,0 M-1,4 l33,0 M-1,7 l33,0 M-1,10 l33,0 M-1,13 l33,1" stroke="#000000" stroke-width="1"/>
            </pattern>`);
};

const getFillIconHorizontalThick = (id) => {
    const myId = 'thick_horizontal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 12, 12" width="100%" height="100%">
                <path d="M-1,2 l33,0 M-1,7 l33,0 M-1,12 l33,0" stroke="#000000" stroke-width="3" />
            </pattern>`);
};

const getFillIconDiagonalThin = (id) => {
    const myId = 'thin_diagonal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 12, 12" width="100%" height="100%">
                <path d="M-1,2 l2,-2 M-1,7 l6,-7 M-2,13 l11,-13 M2,13 l11,-13 M6,13 l11,-13 M10,13 l11,-13" stroke="#000000" stroke-width="1"/>
            </pattern>`);
};

const getFillIconDiagonalThick = (id) => {
    const myId = 'thick_diagonal-' + id;
    return createSVG(myId, `<pattern id="${myId}" viewBox="0, 0, 12, 12" width="100%" height="100%">
                <path d="M-2,4 l12,-14 M-2,13 l12,-14 M6,13 l11,-13" stroke="#000000" stroke-width="3"/>
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
export const getFillOption = name => {
    const fill = areaFills.find(pattern => pattern.name === name);
    return {
        ...fill,
        data: fill.data(counter)
    };

};

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
