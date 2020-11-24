import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';


const testOptions = [
    {
        value: 'testi tyyli',
        tab: 'point',
        dotColor: '#cc99ff',
        dotFilLColor: '#0098dd',
        dotIcon: 'line',
        dotSizeControl: 2
    },
    {
        value: 'tyyli 2',
        tab: 'area'
    },
    {
        value: 'storybooktyyli',
        tab: 'area'
    }
];

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

const placeHolderIcon = (fill) => {
    return(<svg width="32" height="30" x="0" y="0"><path fill={ fill } stroke="#000000" d="m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0"></path></svg>);
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

        
        this.selectStyleFromList = () => {

        };

        this._populateWithStyle = (tab) => {
            let currentStyle = testOptions.find(option => option.value == tab);
            this.setState({ 
                currentTab: currentStyle.tab,
                currentStyle: currentStyle,
                currentIcon: placeHolderIcon
            }); // change tab
            
            currentStyle.styleFormatSelector = currentStyle.tab;
            this.ref.current.setFieldsValue(currentStyle); // Populate fields

        }

        this.colorPickerCallback = (event) => {
        }


        // To reset style list into new style. We
        this._resetAsNewStyle = () => {
            this.setState({
                currentStyle: {}
            });
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
                    <Form.Item name='dotColor' label='Pisteen väri' { ...formLayout }>
                        <ColorPicker onChange={ this.colorPickerCallback } />
                    </Form.Item>
                    <Form.Item name='dotFillColor' label='Pisteen täyttöväri' { ...formLayout }>
                        <ColorPicker onChange={ this.colorPickerCallback } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name='dotIcon' label='Icon' { ...formLayout }>
                        <StylizedRadio icon={ placeHolderIcon } />
                    </Form.Item>
                </Row>
                
                <Row>
                    <Form.Item name='dotSizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                        <InputNumber min={ 1 } max={ 5 } formatter={ number => Math.abs(number) } parser={ number => Math.abs(number) } />
                    </Form.Item>
                </Row>

                <Row>
                    <Preview previewStyle={ this.state.currentStyle } previewIcon={ placeHolderIcon } />
                </Row>
            </Card>
        );
    }

    _getLineTab () {
        return (
            <Card>
                <Row>
                    <Form.Item name='lineColor' label='Viivan väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                    <Form.Item name='fillColor' label='Täyttö väri' { ...formLayout }>
                        <ColorPicker />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item name='lineStyle' label='Viivan tyyli' { ...formLayout }>
                        <StylizedRadio icon={ placeHolderIcon } />
                    </Form.Item>
                </Row>

                <Form.Item name='lineSizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber min={ 1 } max={ 5 } formatter={ number => Math.abs(number) } parser={ number => Math.abs(number) } />
                </Form.Item>
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
                        <StylizedRadio icon={ placeHolderIcon } />
                    </Form.Item>
                </Row>

                <Row>
                    <Form.Item label='Täytön tyyli' { ...formLayout }>
                        <StylizedRadio icon={ placeHolderIcon } />
                    </Form.Item>
                </Row>

                <Form.Item name='outlineSizeControl' label='Size' initialValue={ 3 } { ...formLayout }>
                    <InputNumber min={ 1 } max={ 5 } formatter={ number => Math.abs(number) } parser={ number => Math.abs(number) } />
                </Form.Item>
            </Card>
        );
    }

    render () {
        return (
            <StaticForm ref={ this.ref }>
                <Space direction='vertical'>
                    <Card>
                        <Form.Item label='Tyylit' { ...formLayout } name={ 'styleListSelector' }>
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


                            <Form.Item label='Muokkaa' { ...formLayout } name={ 'styleFormatSelector' } initialValue={ this.state.currentTab }>    
                                <TabSelector { ...formLayout } onChange={ this._changeTab } key={ 'styleSelector' } name='styleSelector' >
                                    <Radio.Button value='point'>Piste</Radio.Button>
                                    <Radio.Button value='line'>Viiva</Radio.Button>
                                    <Radio.Button value='area'>Alue</Radio.Button>
                                </TabSelector>
                            </Form.Item>


                        { this._getCurrentTab( this.state.currentTab ) }
                        
                    </Card>

                </Space>
            </StaticForm>
        );
    }
};