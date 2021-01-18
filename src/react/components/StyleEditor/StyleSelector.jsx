import React from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';
import { Form, Card } from 'antd';
import { ANTD_FORMLAYOUT, LOCALIZATION_BUNDLE } from './constants';
import styled from 'styled-components';

const SelectorForm = styled(Form)`
    width: 400px;

    & > .ant-space {
        width: 100%;
    }
`;

export const StyleSelector = (props) => {

    return (
        <SelectorForm>
            <Card>
                <Form.Item label={<Message bundleKey={ LOCALIZATION_BUNDLE } messageKey='VisualizationForm.subheaders.name' />} { ...ANTD_FORMLAYOUT } name={ 'styleListSelector' }>
                    <Select onChange={ (name) => props.onChange(name) }>
                        { props.styleList.map((singleOption) => {
                            return (
                                <Select.Option
                                    value={ singleOption }
                                    key={ singleOption }
                                >
                                    { singleOption }
                                </Select.Option>
                            );
                        }) }
                    </Select>
                </Form.Item>
            </Card>
        </SelectorForm>
    );
};

StyleSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    styleList: PropTypes.array.isRequired
};
