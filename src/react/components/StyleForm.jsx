import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, ColorPicker, SvgRadioButton, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

import { LineTab } from './styleform/LineTab';
import { AreaTab } from './styleform/AreaTab';
import { PointTab } from './styleform/PointTab';

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
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
            name: 'square',
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

const previewPlaceholderIcon = (options) => {
    const {
        format,
        strokeColor,
        fillColor,
        strokeWidth
    } = options;

    switch(format) {
        case 'point':
           return(<svg width="80" height="80" x="0" y="0"><path fill={ fillColor } stroke={ strokeColor} d="m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0"></path></svg>);
        case 'line':
            return (<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke={ strokeColor } d="M10,15L20,35L40,25" strokeWidth={strokeWidth} strokeLinejoin="miter" strokeLinecap="butt" strokeDasharray="0"></path></svg>);
        case 'area':
            return(<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect fill="#eee" x="0" width="10" height="10" y="0"><rect fill="#eee" x="10" width="10" height="10" y="10"></rect></rect></pattern></defs><rect x="0" y="0" width="80" height="80" fill="url(#checker)"></rect><path fill={ fillColor } stroke={ strokeColor } d="M10,17L40,12L29,40Z" stroke-width={ strokeWidth } stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>);
        default:
            return;
    }
}

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

export class StyleForm extends React.Component {
    constructor (props) {
        super(props);

        this.ref = React.createRef();

        // initialize state with these initialization parameters to show preview correctly
        this.state = this.props.styleSettings;
        this.state.format = 'point'; // Add format manually which doesnt come with style JSON

        this._populateWithStyle = (format) => {
            if (this.props.icons) {
                let currentStyle = this.props.styleList.find(option => option.value == format);
                this.setState({
                    ...currentStyle,
                    format: currentStyle.format
                });
    
                this.ref.current.setFieldsValue(currentStyle); // Populate fields    
            }
        }

        this.styleInputCallback = (event) => {
            this.setState({
                [event.target.id || event.target.name]: {
                    ...this.state[event.target.id || event.target.name],
                    color: event.target.value 
                }
            });
        };

        this.changeTab = (event) => this.setState({ [event.target.name]: event.target.value });

        this.sizeControlCallback = (value) => this.setState({ 'strokeWidth': value, 'size': value });
    }

    _getCurrentTab (tab) {
        switch(tab) {
            case 'point':
                return (
                    <PointTab
                        formLayout={ formLayout }
                        iconSelectorCallback={
                            (event) => {
                                this.setState({
                                    image: {
                                        ...this.state.image,
                                        shape: event.target.value
                                    }
                                });
                            }
                        }
                        markers={ this.props.markers }
                        styleSettings={ this.state }
                    />
                );
            case 'line':
                return (
                    <LineTab
                        formLayout={ formLayout }
                        lineDashCallback={
                            (event) => {
                                this.setState({
                                    stroke: {
                                        ...this.state.stroke,
                                        lineDash: event.target.value
                                    }
                                });
                            }
                        }
                        lineCapCallback={
                            (event) => {
                                this.setState({
                                    stroke: {
                                        ...this.state.stroke,
                                        lineCap: event.target.value
                                    }
                                });
                            }
                        }
                        lineIcons={ lineIcons }
                        styleSettings={ this.state }
                    />
                );
            case 'area':
                return (
                    <AreaTab
                        lineIcons={ lineIcons.lineDash }
                        areaFills={ areaFills }
                        formLayout={ formLayout }
                        lineDashCallback={
                            (event) => {
                                this.setState({
                                    stroke: {
                                        ...this.state.stroke,
                                        lineDash: event.target.value
                                    }
                                });


                            }
                        }
                        lineStyleCallback={
                            (event) => {
                                this.setState({
                                    fill: {
                                        ...this.state.fill,
                                        area: {
                                            ...this.state.fill.area,
                                            pattern: event.target.value
                                        }
                                    }
                                });
                            }                            
                        }
                        styleSettings={ this.state }
                    />
                );
            default:
                return false;
        }
    }

    _createPreview () {
        return (
            <Row>
                <Preview
                    markers={ this.props.markers }
                    fillPatterns={ areaFills }
                    styleSettings={ this.state }
                />
            </Row>
        );
    }

    _getColorPickers () {
        return (
            <Row>
                <Form.Item name='stroke' label='Pisteen väri' { ...formLayout }>
                    <ColorPicker onChange={ this.styleInputCallback } defaultValue={ this.state.stroke.color } />
                </Form.Item>

                { this.state.format !== 'line' ?
                    <Form.Item name='fill' label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback } defaultValue={ this.state.fill.color } />
                    </Form.Item>
                    : false
                }
            </Row>
        );
    }

    _getSizeControl () {
        return (
            <Row>
                <Form.Item name='sizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber
                        min={ 1 }
                        max={ 5 }
                        formatter={ sizeFormatter }
                        parser={ sizeFormatter }
                        onChange={ (value) => {
                            this.setState({
                                stroke: {
                                    ...this.state.stroke,
                                    width: value,
                                    area: {
                                        ...this.state.stroke.area,
                                        width: value
                                    }
                                },
                                image: {
                                    ...this.state.image,
                                    size: value
                                }
                            });
                        } } />
                </Form.Item>
            </Row>
        );
    }

    _buildStyleList (options) {
        return (
            <Form.Item label='Tyylit' { ...formLayout } name={ 'styleListSelector' }>
                <Select onChange={ this._populateWithStyle }>
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

    render () {
        return (
            <StaticForm ref={ this.ref }>
                <Space direction='vertical'>
                    <Card>
                        { this._buildStyleList( this.props.styleList ) }

                        <Form.Item label='Muoto' { ...formLayout } name={ 'format' } initialValue={ this.state.format }>
                            <TabSelector { ...formLayout } onChange={ this.changeTab } key={ 'formatSelector' } name='format' >
                                <Radio.Button value='point'>Piste</Radio.Button>
                                <Radio.Button value='line'>Viiva</Radio.Button>
                                <Radio.Button value='area'>Alue</Radio.Button>
                            </TabSelector>
                        </Form.Item>

                        <Card>
                            { this._getColorPickers() }

                            { this._getCurrentTab( this.state.format ) }

                            { this._getSizeControl() }

                            { this._createPreview() }
                        </Card>
                    </Card>
                </Space>
            </StaticForm>
        );
    }
};
