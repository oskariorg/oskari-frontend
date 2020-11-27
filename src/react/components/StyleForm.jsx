import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
}

const initState = {
    format: 'point',
    strokeColor: '#000000',
    fillColor: '#000000',
    strokeWidth: 3
};

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
        this.state = initState;

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

        this.sizeControlCallback = (value) => this.setState({ 'strokeWidth': value, 'size': value });

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

    _createPreview () {
        return (
            <Row>
                <Preview previewIcon={ previewPlaceholderIcon({ 
                    format: this.state.format,
                    strokeColor: this.state.strokeColor,
                    strokeWidth: this.state.strokeWidth,
                    fillColor: this.state.fillColor 
                }) } />
            </Row>
        );
    }

    _getColorPickers () {
        const strokeColorPicker = (
            <Form.Item name='strokeColor' label='Pisteen väri' { ...formLayout }>
                <ColorPicker onChange={ this.styleInputCallback } />
            </Form.Item>
        );

        const fillColorPicker = this.state.format !== 'line' ? (
            <Form.Item name='fillColor' label='Pisteen täyttöväri' { ...formLayout }>
                <ColorPicker onChange={ this.styleInputCallback } />
            </Form.Item>
        ) : false;

        return (
            <Row>
                { strokeColorPicker }
                { fillColorPicker }
            </Row>
        );
    }

    _getSizeControl () {
        return (
            <Row>
                <Form.Item name='sizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber min={ 1 } max={ 5 } formatter={ sizeFormatter } parser={ sizeFormatter } onChange={ this.sizeControlCallback } />
                </Form.Item>
            </Row>
        );
    }

    _getDotTab () {
        return (
            <>
                <Row>
                    <Form.Item name='dotIcon' label='Ikoni' { ...formLayout }>
                        <StylizedRadio options={ this.props.styleOptions } />
                    </Form.Item>
                </Row>  
            </>
        );
    }

    _getLineTab () {
        return (
            <>
                <Row>
                    <Form.Item name='lineStyle' label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio options={ this.props.styleOptions } />
                    </Form.Item>
                </Row>
            </>
        );
    }

    _getAreaTab () {
        return (
            <>
                <Row>
                    <Form.Item label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio options={ this.props.styleOptions } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Täytön tyyli' { ...formLayout }>
                        <StylizedRadio options={ this.props.styleOptions } />
                    </Form.Item>
                </Row>
            </>

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
