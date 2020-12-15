import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio } from 'antd';
import styled from 'styled-components';

const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
}

const RadioIcon = styled(Radio.Button)`
    height: 34px;    
    margin: 0 7px 10px 0;
    padding: 0;
    width: 34px;
`;

/**
 * @class SvgRadioButton
 * @calssdesc <SvgRadioButton>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 *
 * @example <caption>Basic usage</caption>
 * <SvgRadioButton props={{ ...exampleProps }}/>
 */

export class SvgRadioButton extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Radio.Group defaultValue={ this.props.defaultValue } { ...formLayout } onChange={ this.props.onChange }>
                { this.props.options.map((singleOption, index) => {
                    return(
                        <RadioIcon value={ singleOption.name || index }>
                            <span dangerouslySetInnerHTML={ {__html: singleOption.data }} />
                        </RadioIcon>
                    );
                })}
            </Radio.Group>
        );
    }
};
