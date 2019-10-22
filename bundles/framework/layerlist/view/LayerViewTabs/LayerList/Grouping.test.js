import React from 'react';
import { shallow } from 'enzyme';
import { Grouping } from './Grouping';
import { Select, Option } from 'oskari-ui';
import { GroupingOption } from '../../../model/GroupingOption';

describe('<Grouping/> ', () => {
    const options = [
        new GroupingOption('key1', 'title 1', 'method1'),
        new GroupingOption('key2', 'title 2', 'method2'),
        new GroupingOption('key3', 'title 3', 'method3')
    ];

    const mockGroupingSelected = jest.fn();
    const mutator = {
        setGrouping: mockGroupingSelected
    };

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const wrapper = shallow(<Grouping selected={options[1].getKey()} options={options} mutator={mutator} />);
        expect(wrapper.find(Select).length).toEqual(1);
        expect(wrapper.find(Option).length).toEqual(3);
    });

    test('calls for update', () => {
        expect.assertions(1);
        const wrapper = shallow(<Grouping selected={options[1].getKey()} options={options} mutator={mutator} />);
        wrapper.find(Select).simulate('change');
        expect(mockGroupingSelected.mock.calls.length).toEqual(1);
    });

    test('checks prop types', () => {
        expect.assertions(1);
        const optionsOfInvalidType = [
            {
                key: '4',
                title: 'title 4',
                method: 'method4'
            },
            {
                key: '5',
                title: 'title 5',
                method: 'method5'
            }
        ];
        const invalid = () => <Grouping options={optionsOfInvalidType} mutator={mutator} />;
        expect(invalid).toThrowError('Failed prop type');
    });
});
