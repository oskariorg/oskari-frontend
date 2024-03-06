import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Option, Message } from 'oskari-ui';

const Margin = styled.div`
    padding-top: 5px;
    padding-bottom: 10px;
    & ${Select} {
        width: 100%;
    }
`;
export const LabeledSelect = ({
    name,
    options,
    handleChange,
    ...rest
}) => {
    return (
        <Fragment>
            <Message messageKey={`classify.labels.${name}`}/>
            <Margin>
                <Select
                    className={`t_option-${name}`}
                    onChange={value => handleChange(name, value)}
                    size='small'
                    {...rest}
                >
                    {options.map(({ label, ...rest }, i) => (
                        <Option key={`option-${i}`} {...rest}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </Margin>
        </Fragment>
    );
};

LabeledSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
};
