import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker } from 'oskari-ui';
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
    }

    render () {
        return (
            <Form>
                <Space direction='vertical'>
                    <Card>
                        <Form.Item label='Tyylit' { ...formLayout }>
                            <Select>
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

                        <Card>
                            <Form.Item label='Muokkaa' { ...formLayout }>    
                                <Radio.Group defaultValue={ 'dot' } { ...formLayout } >
                                    <Radio.Button value='dot'>Piste</Radio.Button>
                                    <Radio.Button value='line'>Viiva</Radio.Button>
                                    <Radio.Button value='area'>Alue</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Row>
                                <Form.Item label='Viivan väri' { ...formLayout }>
                                    <ColorPicker />
                                </Form.Item>
                                <Form.Item label='Täyttö väri' { ...formLayout }>
                                    <ColorPicker />
                                </Form.Item>
                            </Row>
                        </Card>
                        
                    </Card>

                </Space>
            </Form>
        );
    }
};