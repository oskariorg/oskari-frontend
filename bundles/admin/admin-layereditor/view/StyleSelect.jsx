import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from '../components/Select';

export const StyleSelect = (props) => {
    const defaultStyle = props.defaultStyle ? props.defaultStyle.getName() : '';
    const options = props.styles.map((style) =>
        <Option key={style.getName()} value={style.getName()}>{style.getTitle()}</Option>
    );
    return (
        <Select defaultValue={defaultStyle}>
            {options}
        </Select>
    );
};

StyleSelect.propTypes = {
    defaultStyle: PropTypes.object,
    styles: PropTypes.array
};
