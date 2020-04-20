import { FilterHandler } from '.';
import { testFilters } from './Filter.test.util';
import { initServices, getBundleInstance } from '../../test.util';
import { FILTER_ALL_LAYERS } from '..';

describe('FilterHandler', () => {
    initServices();
    const handler = new FilterHandler(getBundleInstance());

    test('ui state initializes correctly', () => {
        expect.assertions(3);
        const { searchText, activeFilterId, filters } = handler.getState();
        expect(activeFilterId).toBe(FILTER_ALL_LAYERS);
        expect(searchText).toBe(null);
        expect(filters[0].id).toBe(FILTER_ALL_LAYERS);
    });

    test('has controller', () => {
        expect.assertions(1);
        expect(handler.getController()).not.toBeNull();
    });

    test('adding filters', () => {
        expect.assertions(1);
        testFilters.forEach(cur => handler.addFilter(cur));
        expect(handler.getState().filters.length).toBe(3);
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
