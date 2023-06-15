import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { WarningIcon, Tooltip } from 'oskari-ui';
import { error } from 'console';

describe('<WarningIcon/> ', () => {
    test('renders tooltip component when tooltip prop is passed', () => {
        error('TODO: figure out how to implement testing for existence of antd tooltip div that is outside the wrapper in dom');
        /*
        expect.assertions(1);
        const wrapper = render(<WarningIcon/>);
        excpect(wrapper.queryAllByText(tooltip).length).toBe(0);
        */
    });

    test('does not render tooltip component when tooltip prop is omitted', () => {
        error('TODO: figure out how to implement testing for non-existence of antd tooltip div that is outside the wrapper in dom');
        /*
        expect.assertions(1);
        const wrapper = render(<WarningIcon/>);
        excpect(wrapper.queryAllByText(tooltip).length).toBe(0);
        */
    });

});
