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
        expect(state).toHaveProperty('filter.mutator');
        expect(state).toHaveProperty('collapse.state');
        expect(state).toHaveProperty('collapse.mutator');
    });

    test('has mutator', () => {
        expect.assertions(1);
        expect(handler.getMutator()).not.toBeNull();
    });

    test('grouping updates correctly', () => {
        expect.assertions(3);
        const mockFn = jest.fn();
        handler.addStateListener(mockFn);

        const existingGrouping = GROUPING_PRESET[1].key;
        handler.getMutator().setGrouping(existingGrouping);
        expect(handler.getState().grouping.selected).toBe(existingGrouping);

        const invalidGroupingKey = 'Not existing grouping';
        handler.getMutator().setGrouping(invalidGroupingKey);
        expect(handler.getState().grouping.selected).toBe(existingGrouping);

        // Setting an invalid group key won't change the state.
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
