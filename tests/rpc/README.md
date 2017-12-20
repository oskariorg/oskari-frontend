# RPC tests

JasmineJS test suite for testing Oskari rpc functions, events and requests.

## Getting Started

### Published map

To run tests on your published map set the URL in common_parts.js.

```
mapURL = 'http://demo.oskari.org/?lang=en&uuid=8016f9be-131b-44ab-bcee-5055628dbd42'
```

### Adding tests

Add specs to SpecRunner.html

```
  <!-- include spec files here... -->
  <script src="spec/map_spec.js" defer></script>
```

## Running the tests

SpecRunner.html runs the defined specs. Open it from server (for example http://localhost:8080/Oskari/tests/rpc/SpecRunner.html).

### All tests

To run all tests open SpecRunner.html in browser.

```
SpecRunner.html
```

### Specific spec

Run tests from one spec by specifying the name in the URL or by clicking the spec name in browser.

```
SpecRunner.html?spec=Map
```

### Specific test

Run only one test by specifying the test name in URL or by clicking the test name in browser.

```
SpecRunner.html?spec=Map%20Zoom%20functions%20Gets%20Zoom%20Range
```

## Framework

* [Jasmine](https://jasmine.github.io/) - JS test framework

## RPC documentation

* http://www.oskari.org/examples/rpc-api/rpc_example.html
* http://www.oskari.org/documentation/bundles/framework/rpc
* http://www.oskari.org/api/bundles
* http://www.oskari.org/api/requests
* http://www.oskari.org/api/events

## License

This project is licensed under the MIT License - see the [MIT.LICENSE.md](MIT.LICENSE.md) file for details.
