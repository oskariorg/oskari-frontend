import { getReactRoot, unmountReactRoot }  from './index.js';
import { createRoot } from 'react-dom/client';

describe('test react root', () => {
    describe('create', () => {
        test('should return _reactRoot when element has no _reactRoot prop', () => {
            const element = document.createElement('div');
            const root = getReactRoot(element);
            expect(root).toBeDefined();
            expect(element._reactRoot).toBeDefined();
        });
        test('should not create _reactRoot when one already exists', () => {
            const element = document.createElement('div');
            const someObject = { prop1: 'prop1' };
            element._reactRoot = someObject;
            const root = getReactRoot(element);
            expect(root).toBeDefined();
            expect(element._reactRoot).toEqual(someObject);
        });
    });

    describe('unmount', () => {
        it('should call unmount and delete the reference when element has a reference to _reactRoot', () => {
            const element = document.createElement('div');
            element._reactRoot = createRoot(element);
            unmountReactRoot(element);
            expect(element._reactRoot).toBeUndefined();
        });
    });
});
