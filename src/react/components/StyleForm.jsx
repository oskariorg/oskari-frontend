import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
}

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

const placeHolderIcon = () => {
    return(<svg width="32" height="30" x="0" y="0"><path fill="#000000" stroke="#000000" d="m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0"></path></svg>);
}

const previewPlaceholderIcon = (format, strokeColor, strokeWidth, fillColor) => {
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

const radioTestOptions = [
    {
        value: 'dot',
        icon: placeHolderIcon
    },
    {
        value: 'line',
        icon: placeHolderIcon
    },
    {
        value: 'area',
        icon: placeHolderIcon
    }
];

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

        // initialize state with these parameters to show preview correctly
        this.state = {
            format: 'point',
            lineColor: '#000000',
            strokeWidth: 3
        };

        this._populateWithStyle = (format) => {
            if (this.props.icons) {
                let currentStyle = this.props.icons.find(option => option.value == format);
                this.setState({
                    ...currentStyle,
                    format: currentStyle.format
                });
    
                this.ref.current.setFieldsValue(currentStyle); // Populate fields    
            }
        }

        this.styleInputCallback = (event) => this.setState({ [event.target.id || event.target.name]: event.target.value });

        this.lineSizeCallback = (value) => this.setState({ 'strokeWidth': value});

        this.resetStyles = () => {

        };
    }

    _getCurrentTab (tab) {
        switch(tab) {
            case 'point':
                return this._getDotTab();
            case 'line':
                return this._getLineTab();
            case 'area':
                return this._getAreaTab();
            default:
                return false;
        }
    }

    _createPreview (strokeColor, fillColor, strokeWidth) {
        return (
            <Preview previewIcon={ previewPlaceholderIcon( this.state.format, strokeColor, strokeWidth, fillColor ) } />
        );
    }

    _getDotTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name='dotColor' label='Pisteen väri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback } />
                    </Form.Item>
                    <Form.Item name='dotFillColor' label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name='dotIcon' label='Ikoni' { ...formLayout }>
                        <StylizedRadio options={ radioTestOptions } />
                    </Form.Item>
                </Row>
                
                <Row>
                    <Form.Item name='strokeWidthInput' label='Size' initialValue={ 3 } { ...formLayout }>
                        <InputNumber min={ 1 } max={ 5 } formatter={ sizeFormatter } parser={ sizeFormatter } onChange={ this.lineSizeCallback } />
                    </Form.Item>
                </Row>

                <Row>
                    { this._createPreview(this.state.dotColor, this.state.dotFillColor, this.state.strokeWidthInput) }
                </Row>
            </Card>
        );
    }

    _getLineTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name='lineColor' label='Viivan väri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback }/>
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name='lineStyle' label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio options={ radioTestOptions } icon={ placeHolderIcon } />
                    </Form.Item>
                </Row>

                <Form.Item name='lineSizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber min={ 1 } max={ 5 } formatter={ sizeFormatter } parser={ sizeFormatter } onChange={ this.lineSizeCallback } />
                </Form.Item>

                <Row>
                    { this._createPreview(this.state.lineColor, this.state.lineColor, this.state.strokeWidth) }
                </Row>
            </Card>
        );
    }

    _getAreaTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name='areaLineColor' label='Viivan väri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback } />
                    </Form.Item>
                    <Form.Item name='areaFillColor' label='Täyttö väri' { ...formLayout }>
                        <ColorPicker onChange={ this.styleInputCallback } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio options={ radioTestOptions } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Täytön tyyli' { ...formLayout }>
                        <StylizedRadio options={ radioTestOptions } />
                    </Form.Item>
                </Row>

                <Form.Item name='outlineSizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber min={ 1 } max={ 5 } formatter={ sizeFormatter } parser={ sizeFormatter } onChange={ this.lineSizeCallback } />
                </Form.Item>

                <Row>
                    { this._createPreview(this.state.areaLineColor, this.state.areaFillColor, this.state.strokeWidth) }
                </Row>
            </Card>
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
                            <TabSelector { ...formLayout } onChange={ this.styleInputCallback } key={ 'formatSelector' } name='format' >
                                <Radio.Button value='point'>Piste</Radio.Button>
                                <Radio.Button value='line'>Viiva</Radio.Button>
                                <Radio.Button value='area'>Alue</Radio.Button>
                            </TabSelector>
                        </Form.Item>


                        { this._getCurrentTab( this.state.format ) }
                        
                    </Card>

                </Space>
            </StaticForm>
        );
    }
};
