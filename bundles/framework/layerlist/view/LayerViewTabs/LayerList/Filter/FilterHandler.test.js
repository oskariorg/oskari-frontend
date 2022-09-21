import { afterAll } from '@jest/globals';
import { FilterHandler } from '.';
import { testFilters } from './Filter.test.util';
import { initServices, getBundleInstance, addLayer, addFilter, teardown } from '../../test.util';
import { FILTER_ALL_LAYERS } from '..';

// filters are updated using timers so we need to fake them on jest
jest.useFakeTimers();

describe('FilterHandler', () => {
    initServices();
    const handler = new FilterHandler(getBundleInstance());
    // remove things added to globals so we don't break other tests
    afterAll(() => teardown());

    test('ui state initializes correctly', () => {
        expect.assertions(3);
        const { searchText, activeFilterId, filters } = handler.getState();
        expect(activeFilterId).toBe(FILTER_ALL_LAYERS);
        expect(searchText).toBe('');
        expect(filters[0].id).toBe(FILTER_ALL_LAYERS);
    });

    test('has controller', () => {
        expect.assertions(1);
        expect(handler.getController()).not.toBeNull();
    });

    test('adding filters', () => {
        expect.assertions(3);
        // without any layers there should only be the "all layers" option
        expect(handler.getState().filters.length).toBe(1);
        // after registering the filters there should still be only 1 filter since no layers match them
        testFilters.forEach(cur => addFilter(cur.id, cur.text, cur.tooltip));
        jest.runAllTimers();
        expect(handler.getState().filters.length).toBe(1);
        // add a layer -> should trigger an update for filters that are shown to user
        addLayer('wmslayer');
        jest.runAllTimers();
        // there should now be "all", "newest" and "oldest" filters
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
