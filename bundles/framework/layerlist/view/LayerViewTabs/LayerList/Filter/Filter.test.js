import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '.';
import { testFilters } from './Filter.test.util';
import { Select, Option } from 'oskari-ui';

describe('<Filter/> ', () => {
    const mockFilterSelected = jest.fn();
    const mutator = {
        setActiveFilterId: mockFilterSelected
    };

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const wrapper = shallow(<Filter filters={testFilters} activeFilterId={testFilters[1].id} mutator={mutator} />);

        expect(wrapper.find(Select).length).toBe(1);
        expect(wrapper.find(Option).length).toBe(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        const wrapper = shallow(<Filter filters={testFilters} activeFilterId={testFilters[1].id} mutator={mutator} />);
        wrapper.find(Select).simulate('change');
        expect(mockFilterSelected).toHaveBeenCalled();
    });

    test('checks prop types', () => {
        expect.assertions(1);
        const invalidFilter = {
            not: 'ok'
        };
        const invalid = () => <Filter filters={[invalidFilter]} mutator={mutator} />;
        expect(invalid).toThrowError('Failed prop type');
    });
});
