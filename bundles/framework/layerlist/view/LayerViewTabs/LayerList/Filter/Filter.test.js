import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { Filter } from './Filter';
import { testFilters } from './Filter.test.util';
import { Controller, LocaleProvider } from 'oskari-ui/util';
import { getBundleInstance } from '../../test.util';
// from https://github.com/ant-design/ant-design/blob/4.3.1/components/select/__tests__/index.test.js
const SELECT_ELEMENT_TEST_ID = 'select-test-id';

describe('<Filter/>', () => {
    const instance = getBundleInstance();
    const mockFilterSelected = jest.fn();
    const controller = new Controller({ setActiveFilterId: mockFilterSelected }, ['setActiveFilterId']);
    let wrapper;
    beforeEach(() => {
        wrapper = render(
            <LocaleProvider value={{ bundleKey: instance.getName() }}>
                <Filter data-testid={SELECT_ELEMENT_TEST_ID} filters={testFilters} activeFilterId={testFilters[1].id} controller={controller}/>
            </LocaleProvider>
        );
    });

    test('render select and the selected option', async () => {
        expect.assertions(2);

        const tFilter = wrapper.container.querySelector('.t_filter');
        expect(tFilter).toBeInTheDocument();
        expect(wrapper.getByText(testFilters[1].text)).toBeInTheDocument();
    });
});
