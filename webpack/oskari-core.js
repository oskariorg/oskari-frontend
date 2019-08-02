/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */
// libraries

import 'expose-loader?jQuery!jquery';
import 'script-loader!../libraries/requirejs/require-2.2.0.min.js';
import 'script-loader!../libraries/requirejs/text-plugin-2.0.14.min.js';
import 'expose-loader?DOMPurify!../libraries/dompurify/purify_0.8.0.min.js';
import 'imports-loader?this=>window!../libraries/intl-messageformat/intl-messageformat-with-locales-2.1.0.js';
import '../src/polyfills.js';

// Oskari global
import '../src/global.js';

// Oskari application helpers
import '../src/loader.js';
import '../src/oskari.app.js';
import '../src/BasicBundle.js';

// common styles
import '../resources/css/forms.css';
import '../resources/css/portal.css';
