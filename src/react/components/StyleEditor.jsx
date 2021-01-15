import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from '../util';
import { Message } from './Message';
import { Form, Card, Space, Radio } from 'antd';
import styled from 'styled-components';

import { constants, PointTab, LineTab, AreaTab } from './StyleEditor/';



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

 /**
  * Takes original oskariStyle as param and returns a function. 
  * The returned function takes param like {image.shape: 3}, updates oskariStyle.image.shape to 3 and returns the modified style
  * @param {Object} originalStyle 
  */
 const createStyleAdjuster = (originalStyle) => {
    const style = JSON.parse(JSON.stringify(originalStyle));
    return (changes) => {
        // changes is like: {image.shape: 3}
        Object.keys(changes).forEach(key => {
            const keyParts = key.split('.');
            let partialStyle = style;
            while (keyParts.length) {
                const partialKey = keyParts.shift();
                if (keyParts.length > 0) {
                    // recurse deeper
                    // TODO: make sure part
                    const nextStep = partialStyle[partialKey];
                    if (typeof nextStep !== 'undefined') {
                        partialStyle = nextStep;
                    } else {
                        // create missing structure
                        partialStyle[partialKey] = {};
                        partialStyle = partialStyle[partialKey];
                    }
                } else {
                    // last key part, set value
                    partialStyle[partialKey] = changes[key];
                }
            }
        });
        // return modified style
        return style;
    };
 };

export const StyleEditor = (props) => {
    let [form] = Form.useForm();

    // initialize state with propvided style settings to show preview correctly and set default format as point
    const [state, setState] = useState({ ...props.oskariStyle });
    const updateStyle = createStyleAdjuster(props.oskariStyle);
    
    const [selectedTab, setSelectedTab] = useState(props.format || 'point');

    const formSetCallback = (valueToSet) => form.setFieldsValue(valueToSet); // callback for populating form with provided values
    const stateSetCallback = (newState) => setState({ ...newState}); // callback for setting state of form - with this we force re-render even though state is handled in handler

    props.formHandler.setCallbacks(stateSetCallback, formSetCallback);
    props.formHandler.populateWithStyle(props.oskariStyle);  
    //props.formHandler.populateWithStyle(props.formHandler.getCurrentStyle());
    const onUpdate = (values) => {
        // {image.shape: 3}
        console.log('Form triggered update:', values);
        console.log('Original style:', props.oskariStyle);
        const newStyle = updateStyle(values);
        console.log('Modified style:', newStyle);
        // TODO: trigger onChange(newStyle) instead
        props.onChange(values)
    };

    return (
        <LocaleProvider value={{ bundleKey: constants.LOCALIZATION_BUNDLE }}>
            <Space direction='vertical'>
                <Card>
                    <Message messageKey='VisualizationForm.subheaders.styleFormat' />
                    <TabSelector { ...constants.ANTD_FORMLAYOUT } value={selectedTab} onChange={(event) => setSelectedTab(event.target.value) } >
                        <Radio.Button value='point'><Message messageKey='VisualizationForm.point.tabtitle' /></Radio.Button>
                        <Radio.Button value='line'><Message messageKey='VisualizationForm.line.tabtitle' /></Radio.Button>
                        <Radio.Button value='area'><Message messageKey='VisualizationForm.area.tabtitle' /></Radio.Button>
                    </TabSelector>
                    <Card>
                        <StaticForm form={ form } onValuesChange={ onUpdate } >
                            { selectedTab === 'point' && <PointTab oskariStyle={ props.oskariStyle } /> }
                            { selectedTab === 'line' && <LineTab oskariStyle={ props.oskariStyle } /> }
                            { selectedTab === 'area' && <AreaTab oskariStyle={  props.oskariStyle } /> }
                        </StaticForm>
                    </Card>
                </Card>
            </Space>
        </LocaleProvider>
    );
};
