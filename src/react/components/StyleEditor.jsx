import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Form, Card, Space, Radio } from 'antd';
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


/**
 * @class StyleEditor
 * @calssdesc <StyleEditor>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 *
 * @example <caption>Basic usage</caption>
 * <StyleEditor props={{ ...exampleProps }}/>
 */

export const StyleEditor = (props) => {
    let [form] = Form.useForm();

    // initialize state with propvided style settings to show preview correctly and set default format as point
    const [state, setState] = useState({ ...props.styleSettings });

    const formSetCallback = (valueToSet) => form.setFieldsValue(valueToSet); // callback for populating form with provided values
    const stateSetCallback = (newState) => setState({ ...newState}); // callback for setting state of form - with this we force re-render even though state is handled in handler

    props.formHandler.setCallbacks(stateSetCallback, formSetCallback);
    props.formHandler.populateWithStyle(props.styleSettings);  
    //props.formHandler.populateWithStyle(props.formHandler.getCurrentStyle());

    return (
        <StaticForm form={ form } onValuesChange={ (values) => props.onChange(values) } >
            <Space direction='vertical'>
                <Card>
                    <Form.Item
                        { ...formLayout }
                        name='format'
                        initialValue={ props.format }
                        label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.subheaders.styleFormat' /> }
                    >
                        <TabSelector { ...formLayout } key={ 'formatSelector' }>
                            <Radio.Button value='point'><Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.point.tabtitle' /></Radio.Button>
                            <Radio.Button value='line'><Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.tabtitle' /></Radio.Button>
                            <Radio.Button value='area'><Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.area.tabtitle' /></Radio.Button>
                        </TabSelector>
                    </Form.Item>

                    <Card>
                        { props.format === 'point' &&
                            <PointTab
                                styleSettings={ props.styleSettings }
                                format={ props.format }
                                formLayout={ formLayout }
                                locSettings={ props.locSettings }
                            />
                        }
                        { props.format === 'line' &&
                            <LineTab
                                styleSettings={ props.formHandler.getCurrentStyle() }
                                format={ props.formHandler.getCurrentFormat() }
                                formLayout={ formLayout }
                                lineIcons={ lineIcons }
                                locSettings={ props.locSettings }
                            />
                        }
                        { props.format === 'area' &&
                            <AreaTab
                                styleSettings={ props.formHandler.getCurrentStyle() }
                                format={ props.formHandler.getCurrentFormat() }
                                formLayout={ formLayout }
                                lineIcons={ lineIcons.lineDash }
                                locSettings={ props.locSettings }
                            />
                        }
                    </Card>
                </Card>
            </Space>
        </StaticForm>
    );
};
