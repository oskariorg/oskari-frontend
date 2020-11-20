import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Tooltip, ColorPicker, StylizedRadio } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

const previewBaseSvg = () => {
    return (<svg viewBox="0 0 50 50" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 32 32" width="32" height="32" x="9" y="9" id="marker"></svg></svg>);
};


/**
 * @class Preview
 * @calssdesc <Preview>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 *
 * @example <caption>Basic usage</caption>
 * <Preview props={{ ...exampleProps }}/>
 */

export class Preview extends React.Component {
    constructor (props) {
        super(props);

        this.ref = React.createRef();
    }

    render () {
        return (previewBaseSvg());
    }
};