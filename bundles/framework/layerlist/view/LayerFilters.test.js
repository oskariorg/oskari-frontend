import React from 'react';
import { mount } from 'enzyme';
import { LayerFilters } from './LayerFilters';
import { LayerFilter } from './LayerFilters/LayerFilter';

describe('<LayerFilters/> ', () => {
    test('renders filters correctly', () => {
        expect.assertions(1);
        const mockButtons = {};
        const mockServiceMutatorNotCalled = {};
        mockButtons.button1 = getMockButtonForId(1);
        mockButtons.button2 = getMockButtonForId(2);

        const wrapper = mount(<LayerFilters filters={mockButtons} service={mockServiceMutatorNotCalled}/>);
        expect(wrapper.find(LayerFilter).length).toEqual(Object.keys(mockButtons).length);
    });

    test('passes service mutator correctly to subcomponents', () => {
        expect.assertions(1);
        const mutatorSetter = jest.fn();
        const mockServiceMutator = {
            setCurrentFilter: mutatorSetter
        };
        const mockButtons = {};
        mockButtons.button1 = getMockButtonForId(1);
        const wrapper = mount(<LayerFilters filters={mockButtons} service={mockServiceMutator}/>);
        wrapper.find(LayerFilter).first().simulate('click');
        expect(mutatorSetter.mock.calls.length).toEqual(1);
    });

    const getMockButtonForId = (id) => {
        return {
            id: 'id_' + id,
            text: 'mockText',
            tooltip: 'mockTooltip',
            filterId: 'mockFilterid',
            cls: {
                current: 'mockClass'
            }
        };
    };
});
