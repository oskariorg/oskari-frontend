import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from '../util';
import { Form, Card, Space, Radio } from 'antd';
import styled from 'styled-components';
import 'antd/es/form/style/index.js';

import { constants, PointTab, LineTab, AreaTab, OSKARI_BLANK_STYLE, PreviewButton } from './StyleEditor/';
import { FormToOskariMapper } from './StyleEditor/FormToOskariMapper';

const { TRANSPARENT, SOLID } = constants.FILLS;

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
let tempFillColor;
const styleExceptionHandler = (exceptionStyle, oldStyle) => {
    const isTransparent = exceptionStyle.fill.area.pattern === TRANSPARENT;
    const hasColor = exceptionStyle.fill.color !== '';
    // if fill pattern is set to null, set color as empty
    if (isTransparent) {
        const isColorChange = exceptionStyle.fill.color !== oldStyle.fill.color;
        if (isColorChange) {
            exceptionStyle.fill.area.pattern = SOLID;
        } else {
            tempFillColor = exceptionStyle.fill.color;
            exceptionStyle.fill.color = '';
        }
    } else if (!isTransparent && !hasColor) {
        exceptionStyle.fill.color = tempFillColor || OSKARI_BLANK_STYLE.fill.color;
        tempFillColor = null;
    }

    return exceptionStyle;
};

export const StyleEditor = ({ oskariStyle, onChange, format, tabs }) => {
    let [form] = Form.useForm();
    // if we don't clone the input here the mappings
    //  between form <> style, the values can get mixed up due to mutability
    const style = {
        ...OSKARI_BLANK_STYLE,
        ...oskariStyle
    };

    const formats = tabs || constants.SUPPORTED_FORMATS;

    // initialize state with propvided style settings to show preview correctly and set default format as point
    const fieldValuesForForm = FormToOskariMapper.createFlatFormObjectFromStyle(style);
    const [selectedTab, setSelectedTab] = useState(format || formats[0]);
    const updateStyle = FormToOskariMapper.createStyleAdjuster(style);

    const onUpdate = (values) => {
        // values ex: {image.shape: 3}
        const newStyle = updateStyle(values);
        // if we don't clone the output here the mappings
        //  between form <> style, the values can get mixed up due to mutability
        onChange(styleExceptionHandler(newStyle, style));
    };

    useEffect(() => {
        form.setFieldsValue(fieldValuesForForm);
    }, [style]);

    // Don't render tab selector and show preview in tab if there is only one format
    const showSelector = formats.length > 1;

    const renderTab = () => {
        return (
            <TabSelector { ...constants.ANTD_FORMLAYOUT } value={selectedTab} onChange={(event) => setSelectedTab(event.target.value) } >
                { formats.map(format => <PreviewButton key={format} oskariStyle = { style } format = {format} /> ) }
            </TabSelector>
        );
    }
    return (
        <LocaleProvider value={{ bundleKey: constants.LOCALIZATION_BUNDLE }}>
            <FormSpace direction='vertical'>
                {showSelector  && renderTab() }
                <Card>
                    <StaticForm form={ form } onValuesChange={ onUpdate }>
                        { selectedTab === 'point' && <PointTab oskariStyle={ style } showPreview={!showSelector} /> }
                        { selectedTab === 'line' && <LineTab oskariStyle={ style } showPreview={!showSelector} /> }
                        { selectedTab === 'area' && <AreaTab oskariStyle={  style } showPreview={!showSelector} /> }
                    </StaticForm>
                </Card>
            </FormSpace>
        </LocaleProvider>
    );
};

StyleEditor.propTypes = {
    oskariStyle: PropTypes.object,
    format: PropTypes.oneOf(constants.SUPPORTED_FORMATS),
    tabs: PropTypes.array,
    onChange: PropTypes.func.isRequired
};