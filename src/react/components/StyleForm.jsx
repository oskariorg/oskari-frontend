import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, ColorPicker, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

import { LineTab } from './styleform/LineTab';
import { AreaTab } from './styleform/AreaTab';
import { PointTab } from './styleform/PointTab';

// AntD width settings for grid
const formLayout = {
    labelCol: { span: 24 }, // width of label column in AntD grid settings -> full width = own row inside element
    wrapperCol: { span: 24 } // width of wrapping column in AntD grid settings -> full width = own row inside element
}

const lineIcons = {
    lineDash: [
        {
            name: 'solid',
            data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M0,32 l32,-32" stroke="#000000" stroke-width="3"/></svg>'
        },
        {
            name: 'dash',
            data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M0,32 l32,-32" stroke="#000000" stroke-dasharray="4, 4" stroke-width="3"/></svg>'
        }
    ],
    corners: [
        {
            name: 'miter',
            data: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><polygon points="32 9 9 9 9 16 9 23 9 32 23 32 23 23 32 23 32 9"/><path d="M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z" fill="#fff"/></svg>'
        },
        {
            name: 'round',
            data: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path d="M32,9H19.5A10.5,10.5,0,0,0,9,19.5V32H23V23h9Z"/><path d="M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z" fill="#fff"/></svg>'
        }
    ],
    linecaps: [
        {
            name: 'round',
            data: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><polygon points="9 32 23 32 23 21 18.17 16 13.94 16 9 21 9 32"/></svg>',
        },

        {
            name: 'square',
            data: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect x="9" y="21.04" width="14" height="10.96"/></svg>'
        }
    ]
};

const areaFills = [
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



const TabSelector = styled(Radio.Group)`
    &&& {
        display: flex;
        flex-basis: 0;
        flex-grow: 1;
    }

    .ant-radio-button-wrapper {
        text-align: center;
        width: 100%;
    }
`;

const StaticForm = styled(Form)`
    width: 400px;

    & > .ant-space {
        width: 100%;
    }
`;

const sizeFormatter = (number) => Math.abs(number); 

/**
 * @class StyleForm
 * @calssdesc <StyleForm>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 *
 * @example <caption>Basic usage</caption>
 * <StyleForm props={{ ...exampleProps }}/>
 */

export const StyleForm = (props) => {
    let [form] = Form.useForm();

    // initialize state with propvided style settings to show preview correctly and set default format as point
    const [state, setState] = useState({
        ...props.styleSettings,
        format: 'point'
    });


    /**
     * 
     * @param {String} styleSelected - name of the style selected from the list 
     */
    const _populateWithStyle = (styleSelected) => {
        if (props.styleList) {
            const currentStyle = props.styleList.find(option => option.value == styleSelected);

            setState({
                ...currentStyle
            });

            
            form.setFieldsValue(currentStyle); // Populate fields -- FIX ME
        }
    }

    const changeTab = (event) => setState({ ...state, [event.target.name]: event.target.value });

    /**
     * 
     * @param {String} targetString - target parameter in object provided in full dot notation 
     * @param {String|Number} value - value to be set 
     */
    const updateState = (targetString, value) => {
        const firstTarget = targetString.substr(0, targetString.indexOf('.'));
        let currentTarget = state;
        currentTarget = setStateValue(currentTarget, targetString, value);

        setState({
            ...state,
            [firstTarget]: {
                ...state[firstTarget],
                currentTarget
            }
        });
    };

    /**
     * @method setStateValue
     * @description Parses through and sets provided value into state based on provided target parameter as dot-notation string
     * @param {Object} targetObject - state provided as object
     * @param {String} targetString - target parameter in object provided in full dot notation 
     * @param {String|Number} value - value to be set
     *
     * @returns {Object} - returns object where new value is set
     */
    const setStateValue = (targetObject, targetString, value) => {
        if (typeof targetString === 'string') {
            return setStateValue(targetObject, targetString.split('.'), value); // first cycle of recursion converts targetString into array
        } else if (targetString.length == 1 && value !== undefined) {
            return targetObject[targetString[0]] = value; // We reach end of the recursion
        } else if (targetString.length === 0) {
            return targetObject; // target is already on level 0 so no need for recursion
        } else {
            return setStateValue(targetObject[targetString[0]], targetString.slice(1), value); // recursive call and remove first element from array
        }
    }

    const _getCurrentTab = (tab) => {
        switch(tab) {
            case 'point':
                return (
                    <PointTab
                        styleSettings={ state }
                        formLayout={ formLayout }
                        onChangeCallback={ (key, value) => updateState(key, value) }
                        markers={ props.markers }
                    />
                );
            case 'line':
                return (
                    <LineTab
                        styleSettings={ state }
                        formLayout={ formLayout }
                        onChangeCallback={ (key, value) => updateState(key, value) }
                        lineIcons={ lineIcons }
                    />
                );
            case 'area':
                return (
                    <AreaTab
                        styleSettings={ state }
                        formLayout={ formLayout }
                        onChangeCallback={ (key, value) => updateState(key, value) }
                        lineIcons={ lineIcons.lineDash }
                        areaFills={ areaFills }
                    />
                );
            default:
                return false;
        }
    }

    /**
     * @method _createPreview
     * @description Compose Preview -component
     * @returns {React.Component} Preview component with provided style
     */
    const _createPreview = () => {
        return (
            <Row>
                <Preview
                    markers={ props.markers }
                    fillPatterns={ areaFills }
                    styleSettings={ state }
                />
            </Row>
        );
    }

    /**
     * @method _getColorPickers
     * @description Compose fill and stroke color picker elements for style form
     * 
     * @returns {React.Component} Only stroke color picker or both stroke and fill 
     */
    const _getColorPickers = () => {
        console.log(state);

        return (
            <Row>
                <Form.Item name='stroke' label='Pisteen väri' { ...formLayout }>
                    <ColorPicker
                        onChange={ (event) => updateState('stroke.color', event.target.value) }
                        defaultValue={ state.stroke.color } />
                </Form.Item>

                { state.format !== 'line' ?
                    <Form.Item name='fill' label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker
                            onChange={ (event) => updateState('fill.color', event.target.value) }
                            defaultValue={ state.fill.color }
                        />
                    </Form.Item>
                    : false
                }
            </Row>
        );
    }

    const _getSizeControl = () => {
        return (
            <Row>
                <Form.Item name='size' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber
                        min={ 1 }
                        max={ 5 }
                        formatter={ sizeFormatter }
                        parser={ sizeFormatter }
                        onChange={ (value) => {
                            updateState('stroke.width', value);
                            updateState('stroke.area.width', value);
                            updateState('image.size', value);
                        } } />
                </Form.Item>
            </Row>
        );
    }

    const _buildStyleList = (options) => {
        return (
            <Form.Item label='Tyylit' { ...formLayout } name={ 'styleListSelector' }>
                <Select onChange={ (styleSelected) => _populateWithStyle(styleSelected) }>
                    { options.map((singleOption) => {
                        return (
                            <Select.Option
                                value={ singleOption.value}
                                key={ singleOption.value }
                            >
                                { singleOption.value }
                            </Select.Option>
                        );
                    }) }
                </Select>
            </Form.Item>
        );
    }

    return (
        <StaticForm form={ form }>
            <Space direction='vertical'>
                <Card>
                    { _buildStyleList( props.styleList ) }

                    <Form.Item label='Muoto' { ...formLayout } name={ 'format' } initialValue={ state.format }>
                        <TabSelector { ...formLayout } onChange={ changeTab } key={ 'formatSelector' } name='format' >
                            <Radio.Button value='point'>Piste</Radio.Button>
                            <Radio.Button value='line'>Viiva</Radio.Button>
                            <Radio.Button value='area'>Alue</Radio.Button>
                        </TabSelector>
                    </Form.Item>

                    <Card>
                        { _getColorPickers() }

                        { _getCurrentTab( state.format ) }

                        { _getSizeControl() }

                        { _createPreview() }
                    </Card>
                </Card>
            </Space>
        </StaticForm>
    );
};
