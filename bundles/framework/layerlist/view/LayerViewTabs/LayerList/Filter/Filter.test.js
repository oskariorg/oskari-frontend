import React from 'react';
import { beforeEach, afterEach } from '@jest/globals';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Filter } from './Filter';
import { testFilters } from './Filter.test.util';
import { Controller, LocaleProvider } from 'oskari-ui/util';
import { Select, Option } from 'oskari-ui';
import { getBundleInstance } from '../../test.util';

// from https://github.com/ant-design/ant-design/blob/4.3.1/components/select/__tests__/index.test.js
function toggleOpen (wrapper) {
    act(() => {
        wrapper.find('.ant-select-selector').simulate('mousedown');
        jest.runAllTimers();
        wrapper.update();
    });
}

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('<Filter/>', () => {
    const instance = getBundleInstance();
    const mockFilterSelected = jest.fn();
    const controller = new Controller({ setActiveFilterId: mockFilterSelected }, ['setActiveFilterId']);

    const wrapper = mount(
        <LocaleProvider value={{ bundleKey: instance.getName() }}>
            <Filter filters={testFilters} activeFilterId={testFilters[1].id} controller={controller}/>
        </LocaleProvider>
    );

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const select = wrapper.find('.ant-select');
        // expect(select.html()).toBe('to show html');
        expect(select.exists()).toBe(true);
        toggleOpen(wrapper);
        expect(wrapper.find('.ant-select-item').length).toBe(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        toggleOpen(wrapper);

        wrapper.find('.ant-select-item-option').first().simulate('click');
        expect(mockFilterSelected).toHaveBeenCalled();
    });
});
