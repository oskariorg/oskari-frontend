import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Filter } from './Filter';
import { testFilters } from './Filter.test.util';
import { Controller, LocaleProvider } from 'oskari-ui/util';
import { Option } from 'oskari-ui';
import { getBundleInstance } from '../../test.util';

// from https://github.com/ant-design/ant-design/blob/4.3.1/components/select/__tests__/index.test.js
function toggleOpen (wrapper) {
    act(() => {
        wrapper.find('.ant-select-selector').simulate('mousedown');
        jest.runAllTimers();
        wrapper.update();
    });
}

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
        expect.assertions(3);

        // expect(wrapper.html()).toBe('uncomment to show html');
        const select = wrapper.find('.t_filter');
        expect(wrapper.find(Filter).exists()).toBe(true);

        expect(select.exists()).toBe(true);
        toggleOpen(wrapper);
        expect(wrapper.find(Option.__OskariTestSelector).length).toBe(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        toggleOpen(wrapper);

        wrapper.find(Option.__OskariTestSelector).first().simulate('click');
        expect(mockFilterSelected).toHaveBeenCalled();
    });
});
