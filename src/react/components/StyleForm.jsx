import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio } from 'antd';
import styled from 'styled-components';


const testOptions = [
    {
        value: 'testi tyyli'
    },
    {
        value: 'tyyli 2'
    },
    {
        value: 'storybooktyyli'
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

        this.state = {
            currentTab: 'point'
        };

        this._changeTab = (event) => {
            console.log(event.target.value);
            this.setState({ currentTab: event.target.value });
        };
    
    }

    /*_changeTab (changeTo) {
        this.setState({ currentTab: changeTo });
    }*/
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
                        <span>EMPTY</span>
                    </Card>
                );
        }
    }

    _getDotTab () {
        return (
            <Card>
                <Row>
                    <Form.Item label='Pisteen väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                    <Form.Item label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Viivan tyyli' { ...formLayout }>
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
            <Form>
                <Space direction='vertical'>
                    <Card>
                        <Form.Item label='Tyylit' { ...formLayout }>
                            <Select { ...formLayout }>
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
                            <Form.Item label='Muokkaa' { ...formLayout }>    
                                <Radio.Group defaultValue={ 'point' } { ...formLayout } onChange={ this._changeTab } >
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