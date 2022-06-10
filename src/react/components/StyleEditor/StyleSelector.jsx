import React from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';
import { Card } from 'antd';
import { Form, FormItem } from '../Form';
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
                <FormItem label={<Message bundleKey={ LOCALIZATION_BUNDLE } messageKey='StyleEditor.subheaders.name' />} { ...ANTD_FORMLAYOUT } name={ 'styleListSelector' }>
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
                </FormItem>
            </Card>
        </SelectorForm>
    );
};

StyleSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    styleList: PropTypes.array.isRequired
};
