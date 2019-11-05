import React from 'react';
import { shallow } from 'enzyme';
import { Grouping } from './Grouping';
import { GroupingOption } from '../../../model/GroupingOption';
import { Select, Option } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { getBundleInstance } from '../test.util';

describe('<Grouping/> ', () => {
    const instance = getBundleInstance();
    const locale = instance.getLocalization();
    const mockGroupingSelected = jest.fn();
    const handler = {
        setGrouping: mockGroupingSelected
    };
    const mutator = new Mutator(handler, ['setGrouping']);
    const options = [
        new GroupingOption('key1', 'title 1', 'method1'),
        new GroupingOption('key2', 'title 2', 'method2'),
        new GroupingOption('key3', 'title 3', 'method3')
    ];

    test('renders correct amount of options', () => {
        expect.assertions(2);
        const wrapper = shallow(
            <Grouping
                selected={options[1].getKey()}
                options={options}
                mutator={mutator}
                locale={locale}/>
        );
        expect(wrapper.find(Select).length).toBe(1);
        expect(wrapper.find(Option).length).toBe(3);
    });

    test('calls for update', () => {
        expect.assertions(1);
        const wrapper = shallow(
            <Grouping
                selected={options[1].getKey()}
                options={options}
                mutator={mutator}
                locale={locale}/>
        );
        wrapper.find(Select).simulate('change');
        expect(mockGroupingSelected).toHaveBeenCalled();
    });
});
