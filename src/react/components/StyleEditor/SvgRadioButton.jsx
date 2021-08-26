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
const ButtonVisualization = ({ data }) => {
    let content = data;
    if (content.$$typeof == Symbol.for('react.element')) {
        // assume React-component
        return content;
    }
    if (typeof content === 'function') {
        content = content(uniqueIdCounter++);
    }
    return (<span dangerouslySetInnerHTML={ {__html: content }} />);
};

export const SvgRadioButton = (props) => {
    return (
        <Radio.Group name={ props.id + '.radio' } { ...props.formLayout } onChange={ props.onChange } value={ props.value }>
            { props.options.map((singleOption, index) => {
                return(
                    <RadioIcon key={ props.id + '-' + (singleOption.name || index) } value={ (singleOption.name || index) }>
                        <ButtonVisualization data={singleOption.data} />
                    </RadioIcon>
                );
            })}
        </Radio.Group>
    );
};

SvgRadioButton.propTypes = {
    defaultValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ]).isRequired,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ])
        })
    )
};
