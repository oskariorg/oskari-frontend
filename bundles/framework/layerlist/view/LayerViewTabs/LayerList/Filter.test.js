import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from './Filter';
import { Select, Option } from 'oskari-ui';

describe('<Filter/> ', () => {
    const testFilters = [
        {
            id: 'newest',
            text: 'Newest',
            tooltip: 'The 20 newest layers'
        },
        {
            id: 'oldest',
            text: 'Oldest',
            tooltip: 'The 20 oldest layers'
        }
    ];

    const mockFilterSelected = jest.fn();
    const mutator = {
        setActiveFilterId: mockFilterSelected
    };

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const wrapper = shallow(<Filter filters={testFilters} activeFilterId={testFilters[1].id} mutator={mutator} />);

        expect(wrapper.find(Select).length).toEqual(1);
        expect(wrapper.find(Option).length).toEqual(2);
    });

    test('calls for update', () => {
        expect.assertions(1);
        const wrapper = shallow(<Filter filters={testFilters} activeFilterId={testFilters[1].id} mutator={mutator} />);
        wrapper.find(Select).simulate('change');
        expect(mockFilterSelected.mock.calls.length).toEqual(1);
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
