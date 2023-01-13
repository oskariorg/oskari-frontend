import React from 'react';
import PropTypes from 'prop-types';
import { Message, NumberInput } from 'oskari-ui';
import { ANTD_FORMLAYOUT } from './constants';
import { FormItem } from '../Form';

const sizeFormatter = (number) => Math.abs(number);

export const SizeControl = (props) => {
    return (
        <FormItem
            name={ props.name }
            label={
                <Message messageKey={ props.localeKey }/>
            }
            { ...ANTD_FORMLAYOUT }
        >
            <NumberInput
                min={ 1 }
                max={ 5 }
                formatter={ sizeFormatter }
                parser={ sizeFormatter }
                onKeyDown={(e) => {
                    if (!/^[0-9\b]+$/.test(e.key) && e.key !== 'Backspace') {
                        e.preventDefault();
                    }
                }}
            />
        </FormItem>
    );
};

SizeControl.propTypes = {
    format: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    localeKey: PropTypes.string.isRequired
}