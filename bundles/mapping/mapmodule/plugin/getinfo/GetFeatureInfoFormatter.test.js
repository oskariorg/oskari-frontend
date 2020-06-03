import { afterAll } from '@jest/globals';
import './GetInfoPlugin';
import './GetFeatureInfoFormatter';

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.GetInfoPlugin');

describe('GetInfoPlugin', () => {
    describe('formatters', () => {
        test('has html function', () => {
            expect(typeof plugin.formatters.html).toEqual('function');
        });
    });
});
