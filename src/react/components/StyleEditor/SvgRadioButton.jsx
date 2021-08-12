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

export const SvgRadioButton = (props) => {
    return (
        <Radio.Group name={ props.id + '.radio' } { ...props.formLayout } onChange={ props.onChange } value={ props.value }>
            { props.options.map((singleOption, index) => {
                return(
                    <RadioIcon key={ props.id + '-' + (singleOption.name || index) } value={ (singleOption.name || index) }>
                        <span dangerouslySetInnerHTML={ {__html: singleOption.data }} />
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
            data: PropTypes.string.isRequired,
            name: PropTypes.string,
        })
    )
};
