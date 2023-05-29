import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from '../ColorPicker';
import { Message } from '../Message';
import { SvgRadioButton, SizeControl, constants, PreviewCol } from './index';
import { Row, Col, Tooltip } from 'antd';
import { FormItem } from '../Form';
import { FillPattern, isSolid } from './FillPattern';

const { FILLS, FILL_ORDER } = constants;

const SIZE = 32;
const COLOR = '#000000';
const ID_PREFIX = 'pattern-';

const getFillIcon = (name, fillCode) => {
    const lowerName = name.toLowerCase();
    const id = ID_PREFIX + lowerName;
    const solid = isSolid(fillCode);
    const fillPattern = solid ? COLOR : `url(#${id})`;
    return (
         // use tooltip from antd because oskari-ui tooltip wraps children inside span which has height issue with svg
        <Tooltip title={<Message messageKey={`StyleEditor.tooltips.${lowerName}`}/>}>
            <svg width={SIZE} height={SIZE}>
                { !solid && <FillPattern id={id} fillCode={fillCode} color={COLOR} size={SIZE}/> }
                <rect width={SIZE} height={SIZE} fill={fillPattern} />
            </svg>
        </Tooltip>
    );
};

let fillOtions;
const getFillOptions = () => {
    if (!fillOtions) {
        fillOtions = FILL_ORDER.map(name  => {
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
                    <FormItem
                        { ...constants.ANTD_FORMLAYOUT }
                        name='stroke.area.color'
                        label={ <Message messageKey='StyleEditor.stroke.area.color' /> }
                        >
                        <ColorPicker />
                    </FormItem>
                </Col>

                <Col span={ 12 } >
                    <FormItem
                        { ...constants.ANTD_FORMLAYOUT }
                        name='fill.color'
                        label={ <Message messageKey='StyleEditor.fill.color' /> }
                        >
                        <ColorPicker />
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.area.lineDash'
                    label={ <Message messageKey='StyleEditor.stroke.area.lineDash' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.lineDash } />
                </FormItem>

                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='stroke.area.lineJoin'
                    label={ <Message messageKey='StyleEditor.stroke.area.lineJoin' /> }
                >
                    <SvgRadioButton options={ constants.LINE_STYLES.corners } />
                </FormItem>

                <FormItem
                    { ...constants.ANTD_FORMLAYOUT }
                    name='fill.area.pattern'
                    label={ <Message messageKey='StyleEditor.fill.area.pattern' /> }
                >
                    <SvgRadioButton options={ areaFillOptions } />
                </FormItem>
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
