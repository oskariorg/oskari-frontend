import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from '../util';
import { Message } from './Message';
import { Form, Card, Space, Radio } from 'antd';
import styled from 'styled-components';

import { constants, PointTab, LineTab, AreaTab, OSKARI_BLANK_STYLE } from './StyleEditor/';
import { FormToOskariMapper } from './StyleEditor/FormToOskariMapper';

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
    width: 522px;

    & > .ant-space {
        width: 100%;
    }
`;

const FormSpace = styled(Space)`
    width: 100%;
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

    const style = {
        ... OSKARI_BLANK_STYLE,
        ...props.oskariStyle
    };

    // initialize state with propvided style settings to show preview correctly and set default format as point
    const fieldValuesForForm = FormToOskariMapper.createFlatFormObjectFromStyle(style);
    const [selectedTab, setSelectedTab] = useState(props.format || 'point');
    const updateStyle = FormToOskariMapper.createStyleAdjuster(style);

    const styleExceptionHandler = (style) => {
        // if fill pattern is set to null, set color as empty
        if (typeof style.fill.area.pattern !== 'undefined') {
            if (style.fill.area.pattern === 'null') {
                style.fill.color = '';
            } else if (style.fill.area.pattern !== 'null' && style.fill.color === '') {
                style.fill.color = OSKARI_BLANK_STYLE.fill.color;
            }
        }


        return style;
    };

    const onUpdate = (values) => {
        // values ex: {image.shape: 3}
        const newStyle = updateStyle(values);

        props.onChange(styleExceptionHandler(newStyle))
    };

    useEffect(() => {
        form.setFieldsValue(fieldValuesForForm);
    }, [props.oskariStyle]);

    return (
        <LocaleProvider value={{ bundleKey: constants.LOCALIZATION_BUNDLE }}>
            <FormSpace direction='vertical'>
                <Message messageKey='StyleEditor.subheaders.styleFormat' />
                <TabSelector { ...constants.ANTD_FORMLAYOUT } value={selectedTab} onChange={(event) => setSelectedTab(event.target.value) } >
                    <Radio.Button value='point'><Message messageKey='StyleEditor.subheaders.pointTab' /></Radio.Button>
                    <Radio.Button value='line'><Message messageKey='StyleEditor.subheaders.lineTab' /></Radio.Button>
                    <Radio.Button value='area'><Message messageKey='StyleEditor.subheaders.areaTab' /></Radio.Button>
                </TabSelector>
                <Card>
                    <StaticForm form={ form } onValuesChange={ onUpdate }>
                        { selectedTab === 'point' && <PointTab oskariStyle={ style } /> }
                        { selectedTab === 'line' && <LineTab oskariStyle={ style } /> }
                        { selectedTab === 'area' && <AreaTab oskariStyle={  style } /> }
                    </StaticForm>
                </Card>
            </FormSpace>
        </LocaleProvider>
    );
};

StyleEditor.propTypes = {
    oskariStyle: PropTypes.object,
    format: PropTypes.oneOf(['point', 'line', 'area']),
    onChange: PropTypes.func.isRequired
};
