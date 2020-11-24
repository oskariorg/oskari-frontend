import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio } from 'antd';
import styled from 'styled-components';

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
}

const RadioIcon = styled(Radio.Button)`
    margin: 0 10px 0 0;
    padding: 0;
`;

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

export class StylizedRadio extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Radio.Group defaultValue={ 'dot' } { ...formLayout } { ...this.props } >
                <RadioIcon value='dot'>{ this.props.icon }</RadioIcon>
                <RadioIcon value='line'>{ this.props.icon }</RadioIcon>
                <RadioIcon value='area'>{ this.props.icon }</RadioIcon>
            </Radio.Group>
        );
    }
};