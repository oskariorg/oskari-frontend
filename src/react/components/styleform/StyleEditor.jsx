import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Card, Space, Radio } from 'antd';
import styled from 'styled-components';

import { LineTab } from './LineTab';
import { AreaTab } from './AreaTab';
import { PointTab } from './PointTab';

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
    const [state, setState] = useState({
        ...props.styleSettings,
        format: 'point'
    });

    useEffect(() => {
        _populateWithStyle(); // Populate style with props instead of state to avoid async issues
        setState({
            ...state,
            ...props.styleSettings
        });
    }, [props.styleSettings]);


    /**
     * @method _populateWithStyle
     * @description Populate form with selected style from the list
     *
     * @param {String} styleSelected - name of the style selected from the list 
     */
    const _populateWithStyle = () => {
        const currentStyle = props.styleSettings; // use props instead of state to avoid async problems
       for (const single in currentStyle) {
           const targetToSet = typeof currentStyle[single] !== 'object' ? '' : currentStyle[single];
           const valueToSet = typeof currentStyle[single] === 'object' ? null : currentStyle[single]; //set value if it is on the first level
           _composeTargetString(targetToSet, single, valueToSet);
        }
    }

    /**
     * @method _composeTargetString
     * @description Loop through provided target with recursive loop if target contains child objects and compose target string to set field values correctly
     *
     * @param {Object|String} target             - target to loop through
     * @param {String} container                 - containing object key as String to use as a base for name
     * @param {Object|Boolean|String} valueToSet - value to set in the end. If object provided we go through it recursively.
     */
    const _composeTargetString = (target, container, valueToSet) => {
        if (typeof valueToSet !== 'object' && typeof target !== 'object') {
            form.setFieldsValue({ [container]: valueToSet });
        } else {
            for (const singleTarget in target) {
                _composeTargetString(target[singleTarget], (container + '.' + singleTarget), target[singleTarget]);
            }
        }
    }

    /**
     * @method changeTab
     * @description Set selected tab in to state
     *
     * @param {Event} event - DOM event reference triggered by onChange
     *
     */
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
     *
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

    return (
        <StaticForm form={ form }>
            <Space direction='vertical'>
                <Card>
                    <Form.Item label='Muoto' { ...formLayout } name={ 'format' } initialValue={ state.format }>
                        <TabSelector { ...formLayout } onChange={ changeTab } key={ 'formatSelector' } name='format' >
                            <Radio.Button value='point'>Piste</Radio.Button>
                            <Radio.Button value='line'>Viiva</Radio.Button>
                            <Radio.Button value='area'>Alue</Radio.Button>
                        </TabSelector>
                    </Form.Item>

                    <Card>
                        { state.format === 'point' &&
                            <PointTab
                                styleSettings={ state }
                                formLayout={ formLayout }
                                onChangeCallback={ (key, value) => updateState(key, value) }
                                markers={ props.markers }
                                locSettings={ props.locSettings }
                            />
                        }
                        { state.format === 'line' &&
                            <LineTab
                                styleSettings={ state }
                                formLayout={ formLayout }
                                onChangeCallback={ (key, value) => updateState(key, value) }
                                lineIcons={ lineIcons }
                                locSettings={ props.locSettings }
                            />
                        }
                        { state.format === 'area' &&
                            <AreaTab
                                styleSettings={ state }
                                formLayout={ formLayout }
                                onChangeCallback={ (key, value) => updateState(key, value) }
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
