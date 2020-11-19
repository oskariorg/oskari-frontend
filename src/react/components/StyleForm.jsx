import React, { Component, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio } from 'antd';
import styled from 'styled-components';


const testOptions = [
    {
        value: 'testi tyyli',
        style: 'point',
        dotColorPicker: '#cc99ff',
        dotFillColorPicker: '#0098dd',
        dotIcon: 'line'
    },
    {
        value: 'tyyli 2',
        style: 'area'
    },
    {
        value: 'storybooktyyli',
        style: 'area'
    }
];

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
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

        this.state = {
            currentTab: 'point'
        };

        this._changeTab = (event) => {
            this.setState({ currentTab: event.target.value });
        };

        
        this._populateWithStyle = (style) => {
            let currentStyle = testOptions.find(option => option.value == style);
            this.setState({ currentTab: currentStyle.style }); // change tab
            
            currentStyle.styleSelectorItem = currentStyle.style;
            this.ref.current.setFieldsValue(currentStyle); // Populate fields
            
            console.log(currentStyle);
            console.log(this.state);
        }

        this.colorPickerCallback = (event) => {
            console.log(event.target.value);
        }
    
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
                return (
                    <Card>
                        <span>EMPTY!</span>
                    </Card>
                );
        }
    }

    _getDotTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name={ 'dotColorPicker' } label='Pisteen väri' { ...formLayout }>
                        <ColorPicker onChange={ this.colorPickerCallback } />
                    </Form.Item>
                    <Form.Item name={ 'dotFillColorPicker' } label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker onChange={ this.colorPickerCallback } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name={ 'dotIcon' } label='Icon' { ...formLayout }>
                        <StylizedRadio />
                    </Form.Item>
                </Row>
            </Card>
        );
    }

    _getLineTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name={ 'lineColor' } label='Viivan väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                    <Form.Item name={ 'fillColor' } label='Täyttö väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name={ 'lineStyle' } label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio />
                    </Form.Item>
                </Row>
            </Card>
        );
    }

    _getAreaTab () {
        return (
            <Card>
                <Row>
                    <Form.Item label='Viivan väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                    <Form.Item label='Täyttö väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Täytön tyyli' { ...formLayout }>
                        <StylizedRadio />
                    </Form.Item>
                </Row>
            </Card>
        );
    }

    render () {
        return (
            <Form ref={ this.ref }>
                <Space direction='vertical'>
                    <Card>
                        <Form.Item label='Tyylit' { ...formLayout }>
                            <Select onChange={ this._populateWithStyle }>
                                { testOptions.map((singleOption) => {
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

                        <Row>
                            <Form.Item label='Muokkaa' { ...formLayout } name={ 'styleSelectorItem' } initialValue={ this.state.currentTab }>    
                                <Radio.Group { ...formLayout } onChange={ this._changeTab } key={ 'styleSelector' } name='styleSelector' >
                                    <Radio.Button value='point'>Piste</Radio.Button>
                                    <Radio.Button value='line'>Viiva</Radio.Button>
                                    <Radio.Button value='area'>Alue</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Row>

                        { this._getCurrentTab( this.state.currentTab ) }
                        
                    </Card>

                </Space>
            </Form>
        );
    }
};