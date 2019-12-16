import React from 'react';
import { mount } from 'enzyme';
import { Filter } from '.';
import { testFilters } from './Filter.test.util';
import { Controller, LocaleContext } from 'oskari-ui/util';
import { getBundleInstance } from '../../test.util';

describe('<Filter/>', () => {
    const instance = getBundleInstance();
    const mockFilterSelected = jest.fn();
    const controller = new Controller({ setActiveFilterId: mockFilterSelected }, ['setActiveFilterId']);

    let wrapper = mount(
        <LocaleContext.Provider value={{ bundleKey: instance.getName() }}>
            <Filter filters={testFilters} activeFilterId={testFilters[1].id} controller={controller}/>
        </LocaleContext.Provider>
    );

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const select = wrapper.find('Select').first();
        expect(select).not.toBe(null);
        select.simulate('click');
        expect(wrapper.find('MenuItem').length).toBe(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        wrapper.find('Select').first().simulate('click');
        wrapper.find('MenuItem').first().simulate('click');
        expect(mockFilterSelected).toHaveBeenCalled();
    });
});
