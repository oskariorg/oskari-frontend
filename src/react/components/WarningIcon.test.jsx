import React from 'react';
import { mount } from 'enzyme';
import { WarningIcon, Tooltip } from 'oskari-ui';

describe('<WarningIcon/> ', () => {
    test('renders tooltip component when tooltip prop is passed', () => {
        expect.assertions(1);
        const tooltip = 'test value';
        const wrapper = mount(<WarningIcon tooltip={tooltip}/>);
        expect(wrapper.find(Tooltip).length).toEqual(1);
    });

    test('does not render tooltip component when tooltip prop is omitted', () => {
        expect.assertions(1);
        const wrapper = mount(<WarningIcon/>);
        expect(wrapper.find(Tooltip).length).toEqual(0);
    });
});
