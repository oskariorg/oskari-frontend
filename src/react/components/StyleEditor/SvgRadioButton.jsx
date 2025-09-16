import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import styled from 'styled-components';

const RadioIcon = styled(Radio.Button)`
    height: 34px;
    margin: 0 7px 10px 0;
    padding: 0;
    width: 34px;

    &::before {
        display: none !important;
    }

    & {
        border: 1px solid #d9d9d9
    }

    .ant-radio-button-wrapper-checked {
        border-left: 1px solid;
    }
`;

const ButtonVisualization = ({ content, src, data }) => {
    if (content && content.$$typeof == Symbol.for('react.element')) {
        // assume React-component
        return content;
    }
    if (src) {
        return (<img src={src}/>);
    }
    if (data) {
        return (<span dangerouslySetInnerHTML={{__html: data }}/>)
    }
    return null;
};

export const SvgRadioButton = ({id, options, onChange, formLayout, value}) => {
    return (
        <Radio.Group name={ `${id}.radio` } { ...formLayout } onChange={ onChange } value={ value }>
            { options.map((opt, index) => {
                const value = typeof opt.name === 'undefined' ? index : opt.name;
                return(
                    <RadioIcon key={ `${id}-${value}` } value={ value }>
                        <ButtonVisualization {...opt} />
                    </RadioIcon>
                );
            })}
        </Radio.Group>
    );
};

SvgRadioButton.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.string,
            content: PropTypes.node,
            src: PropTypes.string,
            name: PropTypes.any
        })
    )
};
