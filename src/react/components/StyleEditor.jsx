import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from '../util';
import { Message } from './Message';
import { Form, Card, Space, Radio } from 'antd';
import styled from 'styled-components';

import { constants, PointTab, LineTab, AreaTab } from './StyleEditor/';
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
    const fieldValuesForForm = FormToOskariMapper.createFlatFormObjectFromStyle(props.oskariStyle);
    form.setFieldsValue(fieldValuesForForm);
    const [selectedTab, setSelectedTab] = useState(props.format || 'point');
    const updateStyle = FormToOskariMapper.createStyleAdjuster(props.oskariStyle);
    const onUpdate = (values) => {
        // {image.shape: 3}
        const newStyle = updateStyle(values);
        props.onChange(newStyle)
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

StyleEditor.propTypes = {
    oskariStyle: PropTypes.object,
    format: PropTypes.oneOf(['point', 'line', 'area']),
    onChange: PropTypes.func.isRequired
};
