import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, NumberInput } from 'oskari-ui';
import { InlineFlex } from './InlineFlex';
import { StyledComponent } from './StyledFormComponents';
import { InfoTooltip } from './InfoTooltip';

const defaultOptions = {
    allowNegative: true,
    allowZero: true
};
const validationFilter = (onChange, options = {}) => {
    const { allowZero = defaultOptions.allowZero, allowNegative = defaultOptions.allowNegative } = options;
    return value => {
        if (value === '' || value === undefined || value === null) {
            // clear value
            onChange();
            return;
        }
        if (!Oskari.util.isNumber(value)) {
            // Maybe not fully typed in yet, like a (-) sign or part of suffix.
            // Don't trigger change
            return;
        }
        if ((!allowNegative && value < 0) || (!allowZero && value === 0)) {
            onChange();
            return;
        }
        onChange(value);
    };
};
export const Numeric = ({
    messageKey,
    infoKeys,
    suffix = '',
    allowNegative = defaultOptions.allowNegative,
    allowZero = defaultOptions.allowZero,
    value = '',
    onChange,
    ...rest }) => {
    const validationOptions = { allowNegative, allowZero };

    const parseNumber = value => {
        const num = value.replace(suffix, '');
        return (!Oskari.util.isNumber(num) && num !== '-') ? '' : num;
    };

    const formatNumber = value => {
        if (value === '-') {
            return '-';
        }
        if (!Oskari.util.isNumber(value)) {
            return '';
        }
        return value + suffix;
    };

    let input =
        <NumberInput
            value={value}
            onChange={validationFilter(onChange, validationOptions)}
            formatter={formatNumber}
            parser={parseNumber}
            {...rest} />;

    if (messageKey || infoKeys) {
        input =
            <StyledComponent>
                <InlineFlex>
                    {input}
                </InlineFlex>
            </StyledComponent>;
    }
    return (
        <Fragment>
            { messageKey && <Message messageKey={messageKey}/> }
            { infoKeys && <InfoTooltip messageKeys={infoKeys}/> }
            { input }
        </Fragment>
    );
};
Numeric.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    messageKey: PropTypes.string,
    infoKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string, PropTypes.any]),
    suffix: PropTypes.string,
    allowNegative: PropTypes.bool,
    allowZero: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};
