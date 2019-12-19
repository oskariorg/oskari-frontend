import React from 'react';
import { shallow } from 'enzyme';
import { Grouping } from './Grouping';
import { GroupingOption } from '../../../model/GroupingOption';
import { Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

describe('<Grouping/>', () => {
    const mockGroupingSelected = jest.fn();
    const controller = new Controller({ setGrouping: mockGroupingSelected }, ['setGrouping']);
    const options = [
        new GroupingOption('key1', 'title 1', 'method1'),
        new GroupingOption('key2', 'title 2', 'method2'),
        new GroupingOption('key3', 'title 3', 'method3')
    ];
    const localeContextMock = { getMessage: () => {} };

    let wrapper = shallow(
        <Grouping selected={options[1].getKey()} options={options} controller={controller} {...localeContextMock} />);

    test('renders correct amount of options', () => {
        expect.assertions(2);
        expect(wrapper.find(Select).length).toBe(1);
        expect(wrapper.find(Option).length).toBe(3);
    });

    test('calls for update', () => {
        expect.assertions(1);
        wrapper.find(Select).simulate('change');
        expect(mockGroupingSelected).toHaveBeenCalled();
    });
});
