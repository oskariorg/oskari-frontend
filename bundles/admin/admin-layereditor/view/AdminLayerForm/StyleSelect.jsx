import React from 'react';
import PropTypes from 'prop-types';
import {Select, Option} from '../../components/Select';

export const StyleSelect = ({styles, currentStyle, service}) => {
    const options = styles.map((style) =>
        <Option key={style.name} value={style.name}>{style.title}</Option>
    );
    return (
        <Select defaultValue={currentStyle} onChange={(evt) => service.setStyle(evt)}>
            {options}
        </Select>
    );
};

StyleSelect.propTypes = {
    currentStyle: PropTypes.string,
    styles: PropTypes.array,
    service: PropTypes.any
};
