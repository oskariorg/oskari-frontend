import React from 'react';
import { render } from '@testing-library/react';
import { Grouping } from './Grouping';
import { GroupingOption } from '../../../model/GroupingOption';
import { Controller } from 'oskari-ui/util';
import { beforeEach } from '@jest/globals';
const SELECTED_OPTION_TITLE = 'selected';
const SELECTED_OPTION_KEY = 'key2';

describe('<Grouping/>', () => {
    const mockGroupingSelected = jest.fn();
    const controller = new Controller({ setGrouping: mockGroupingSelected }, ['setGrouping']);
    const options = [
        new GroupingOption('key1', 'title 1', 'method1'),
        new GroupingOption(SELECTED_OPTION_KEY, SELECTED_OPTION_TITLE, 'method2'),
        new GroupingOption('key3', 'title 3', 'method3')
    ];
    const localeContextMock = { getMessage: () => {} };

    let wrapper;
    beforeEach(() => {
        wrapper = render(<Grouping selected={SELECTED_OPTION_KEY} options={options} controller={controller} {...localeContextMock} />);
    });

    test('renders select and the selected option when dropdown is closed', () => {
        expect.assertions(2);

        // find the input
        expect(wrapper.container.querySelectorAll('input').length).toBe(1);

        // when dropdown is closed the selected option will be rendered and visible
        expect(wrapper.getAllByTitle(SELECTED_OPTION_TITLE).length).toBe(1);
    });
});
