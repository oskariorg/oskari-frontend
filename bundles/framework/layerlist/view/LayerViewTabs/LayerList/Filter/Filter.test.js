import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '.';
import { testFilters } from './Filter.test.util';
import { Select, Option } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { getBundleInstance } from '../../test.util';

describe('<Filter/> ', () => {
    const instance = getBundleInstance();
    const locale = instance.getLocalization();
    const mockFilterSelected = jest.fn();
    const handler = {
        setActiveFilterId: mockFilterSelected
    };
    const mutator = new Mutator(handler, ['setActiveFilterId']);

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const wrapper = shallow(<Filter
            filters={testFilters}
            activeFilterId={testFilters[1].id}
            mutator={mutator}
            locale={locale}/>);

        expect(wrapper.find(Select).length).toBe(1);
        expect(wrapper.find(Option).length).toBe(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        const wrapper = shallow(<Filter
            filters={testFilters}
            activeFilterId={testFilters[1].id}
            mutator={mutator}
            locale={locale}/>);
        wrapper.find(Select).simulate('change');
        expect(mockFilterSelected).toHaveBeenCalled();
    });
});
