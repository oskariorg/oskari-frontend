import { FilterHandler } from '.';
import { testFilters } from './Filter.test.util';
import { initServices, getBundleInstance } from '../../test.util';

describe('FilterHandler', () => {
    initServices();
    const handler = new FilterHandler(getBundleInstance());

    test('ui state initializes correctly', () => {
        expect.assertions(1);
        expect(handler.getState()).toStrictEqual({
            activeFilterId: null,
            searchText: null,
            filters: []
        });
    });

    test('has controller', () => {
        expect.assertions(1);
        expect(handler.getController()).not.toBeNull();
    });

    test('adding filters', () => {
        expect.assertions(1);
        testFilters.forEach(cur => handler.addFilter(cur));
        expect(handler.getState().filters.length).toBe(2);
    });

    test('notifying state changes', () => {
        expect.assertions(3);
        const mockFn = jest.fn();
        handler.addStateListener(mockFn);
        handler.getController().setActiveFilterId('newest');
        handler.getController().setSearchText('base');

        const { searchText, activeFilterId } = handler.getState();
        expect(activeFilterId).toBe('newest');
        expect(searchText).toBe('base');
        expect(mockFn).toHaveBeenCalledTimes(2);
    });
});
