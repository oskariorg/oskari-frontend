/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */
// libraries

import 'expose-loader?jQuery!jquery';
// registers global variable "MobileDetect" used in src/util.js:
import 'expose-loader?MobileDetect!mobile-detect';
import '../src/polyfills.js';

// Oskari global
import '../src/global.js';

// common css
import '../resources/css/forms.css';
import '../resources/css/portal.css';
