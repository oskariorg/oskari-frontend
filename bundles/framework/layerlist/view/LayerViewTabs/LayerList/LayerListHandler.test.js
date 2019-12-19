import { LayerListHandler } from './LayerListHandler';
import { initServices, getBundleInstance } from '../test.util';
import { GROUPING_PRESET } from './preset';

describe('LayerListHandler', () => {
    initServices();
    const handler = new LayerListHandler(getBundleInstance());

    test('ui state initializes correctly', () => {
        expect.assertions(7);
        const state = handler.getState();
        expect(state).toHaveProperty('loading', false);
        expect(state).toHaveProperty('grouping.selected');
        expect(state).toHaveProperty('grouping.options');
        expect(state).toHaveProperty('filter.state');
        expect(state).toHaveProperty('filter.controller');
        expect(state).toHaveProperty('collapse.state');
        expect(state).toHaveProperty('collapse.controller');
    });

    test('has controller', () => {
        expect.assertions(1);
        expect(handler.getController()).not.toBeNull();
    });

    test('grouping updates correctly', () => {
        expect.assertions(3);
        const mockFn = jest.fn();
        handler.addStateListener(mockFn);

        const existingGrouping = GROUPING_PRESET[1].key;
        handler.getController().setGrouping(existingGrouping);
        expect(handler.getState().grouping.selected).toBe(existingGrouping);

        const invalidGroupingKey = 'Not existing grouping';
        handler.getController().setGrouping(invalidGroupingKey);
        expect(handler.getState().grouping.selected).toBe(existingGrouping);

        // Setting an invalid group key won't change the state.
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
