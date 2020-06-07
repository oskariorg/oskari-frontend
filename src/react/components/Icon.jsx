import React from 'react';
import AntIcon from '@ant-design/icons';
import 'antd/es/icon/style/index.js';

// Note! Ant icon doesn't have any graphics included to optimize bundle size
// This is purely to provide custom SVG icons to be implemented with
// antd icon API
export const Icon = props => <AntIcon {...props} />;
