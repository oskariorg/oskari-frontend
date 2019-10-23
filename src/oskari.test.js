
const Oskari = require('./oskari.es6').default;

describe('Oskari', () => {
    test('urls.getRoute()', () => {
        Oskari.urls.set('api', 'random');
        expect(Oskari.urls.getRoute('testing')).toEqual('random?action_route=testing');
        expect(Oskari.urls.getRoute('testing', { test: 1})).toEqual('random?test=1&action_route=testing');
        
        Oskari.urls.set('api', 'random?');
        expect(Oskari.urls.getRoute('testing')).toEqual('random?action_route=testing');
        expect(Oskari.urls.getRoute('testing', { test: 1})).toEqual('random?test=1&action_route=testing');
        
        Oskari.urls.set('api', 'random?foo=bar');
        expect(Oskari.urls.getRoute('testing')).toEqual('random?foo=bar&action_route=testing');
        expect(Oskari.urls.getRoute('testing', { test: 1})).toEqual('random?foo=bar&test=1&action_route=testing');
    });
});
