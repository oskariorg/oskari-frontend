import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import styled from 'styled-components';

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

export const SvgRadioButton = (props) => {
    return (
        <Radio.Group defaultValue={ props.defaultValue } { ...props.formLayout } onChange={ props.onChange }>
            { props.options.map((singleOption, index) => {
                return(
                    <RadioIcon key={ props.name + '-' + (singleOption.name || index) } value={ singleOption.name || index }>
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
