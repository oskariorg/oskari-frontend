# RPC tests

JasmineJS test suite for testing Oskari RPC functions, events and requests.

## Getting Started

### Published map

By default, tests use the demo map in Paikkatietoikkuna. If you add a new RPC function, event, or request, you need to run a test for it on your own published map that includes the new feature.

To run tests on your published map, set `SpecRunner.html` to use `common_parameters.js`.

``` html
  <!-- include source files here... -->
  <script src="src/common_parameters.js" defer></script>
```

Set the URL in `common_parameters.js` and adjust other parameters if needed.

``` javascript
var mapURL = 'http://demo.oskari.org/?lang=en&uuid=8016f9be-131b-44ab-bcee-5055628dbd42'
```

### Adding tests

Add specs to `SpecRunner.html`.

``` html
  <!-- include spec files here... -->
  <script src="spec/map_spec.js" defer></script>
```

## Running the tests

The `tests` folder must be deployed to some file server running locally so that it can be accessed using localhost. For example, if you use the Tomcat package of Oskari, you can copy the `tests` folder under `sample-application/dist`.

SpecRunner.html runs the defined specs. Open it from a server (for example [http://localhost:8080/Oskari/dist/tests/rpc/SpecRunner.html](http://localhost:8080/Oskari/dist/tests/rpc/SpecRunner.html)).

### All tests

To run all tests open `SpecRunner.html` in browser.

``` bash
/SpecRunner.html
```

### Specific spec

Run tests from one spec by specifying the name in the URL or by clicking the spec name in browser.

``` bash
/SpecRunner.html?spec=Map
```

### Specific test

Run only one test by specifying the test name in URL or by clicking the test name in browser.

``` bash
/SpecRunner.html?spec=Map%20Zoom%20functions%20Gets%20Zoom%20Range
```

## Framework

* [Jasmine](https://jasmine.github.io/) - JS test framework

## RPC documentation

* [RPC example](https://www.oskari.org/examples/rpc-api/)
* RPC documentation
    * [latest stable](https://www.oskari.org/documentation/api/bundles/latest/RPC)
    * [nightly build](https://www.oskari.org/documentation/api/bundles/unreleased/RPC)
* [Bundles](https://www.oskari.org/documentation/api/bundles)
* [RPC requests](https://www.oskari.org/documentation/api/requests)
* [RPC events](https://www.oskari.org/documentation/api/events)

## License

This project is licensed under the MIT License - see the [MIT.LICENSE.md](MIT.LICENSE.md) file for details.
