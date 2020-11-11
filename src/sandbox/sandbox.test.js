describe('Sandbox', () => {
    test('getStatefulComponents()', () => {
        const sb = Oskari.getSandbox('statefultesting');
        // initial count is 0
        expect(Object.keys(sb.getStatefulComponents()).length).toEqual(0);

        sb.registerAsStateful('testbundle');
        // registering without second param/impl does nothing
        expect(Object.keys(sb.getStatefulComponents()).length).toEqual(0);
        
        // stateful components are required to have getState() function
        // also for linking purposes they need to implement getStateParameters() but that is not required
        sb.registerAsStateful('testbundle', {
            getState: () => {}
        });
        sb.registerAsStateful('testbundle2', {
            getState: () => {}
        });
        // after registering 2
        expect(Object.keys(sb.getStatefulComponents()).length).toEqual(2);

        // unregistering one should still have one
        sb.unregisterStateful('testbundle');
        expect(Object.keys(sb.getStatefulComponents()).length).toEqual(1);

        // trying to re-register an existing bundle without impl unregisters it
        sb.registerAsStateful('testbundle2');
        expect(Object.keys(sb.getStatefulComponents()).length).toEqual(0);
    });

    test('generateMapLinkParameters()', () => {
        const sb = Oskari.getSandbox('linkTesting');
        // initial value is null
        expect(sb.generateMapLinkParameters()).toBeNull();
        // good value is written out
        expect(sb.generateMapLinkParameters({ test: 'testing'})).toEqual("test=testing");
        // non-object params should be ignored
        expect(sb.generateMapLinkParameters('test')).toBeNull();
        // weird case, just documenting current behavior
        expect(sb.generateMapLinkParameters(['test'])).toEqual("0=test");
        
        // stateful bundles implementing getStateParameters() should be included in link
        sb.registerAsStateful('testbundle', {
            getState: () => {},
            getStateParameters: () => 'testbundle=3'
        });
        sb.registerAsStateful('testbundle2', {
            getState: () => {},
            getStateParameters: () => 'value=testing'
        });
        expect(sb.generateMapLinkParameters()).toEqual("testbundle=3&value=testing");
        // given params are appended to stateful stuff
        expect(sb.generateMapLinkParameters({
            extra: 'additional'
        })).toEqual("testbundle=3&value=testing&extra=additional");
    });

});
