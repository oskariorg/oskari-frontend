import { LayerListHandler } from './LayerListHandler';
import { initServices, getBundleInstance } from '../test.util';

describe('LayerListHandler', () => {
    initServices();
    const handler = new LayerListHandler(getBundleInstance());

    test('ui state initializes correctly', () => {
        expect.assertions(1);
        expect(handler.getState()).toStrictEqual({
            activeFilterId: null,
            searchText: null,
            filters: []
        });
    });

    test('has mutator', () => {
        expect.assertions(1);
        expect(handler.getMutator()).not.toBeNull();
    });

    test('notifying state changes', () => {
        expect.assertions(2);
        const mockFn = jest.fn();
        handler.addStateListener(mockFn);
        handler.getMutator().setGrouping('organization');

        const { grouping } = handler.getState();
        expect(grouping.selected).toBe('organization');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
