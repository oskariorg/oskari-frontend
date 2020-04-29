
import React from 'react';
import AntAlert from 'antd/es/alert';
// index.js imports less-files. This is useful for theme support. There's also a precompiled css that can be imported
import 'antd/es/alert/style/index.js';

export const Alert = props => <AntAlert {...props} />;
