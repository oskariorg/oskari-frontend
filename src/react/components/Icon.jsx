import React from 'react';
import AntIcon from '@ant-design/icons';
import 'antd/es/icon/style/index.js';

// Note! Ant icon doesn't have any graphics included to optimize bundle size
// This is purely to provide custom SVG icons to be implemented with
// antd icon API
export const Icon = props => <AntIcon {...props} />;

/*
# Using icons

1) Check an existing icon from https://ant.design/components/icon/
2) Import the icon to component using the icon directly from '@ant-design/icons':

    import { CalendarOutlined } from '@ant-design/icons';

## Custom icons

1) Create an icon component yourself from SVG:
```
import { Icon } from 'oskari-ui';

const defaultColor = '#979797';
const OwnSvg = ({ fill = defaultColor }) => (
    <svg width="20px" height="20px" viewBox="0 0 20 20">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-10.000000, -10.000000)" fill={fill}>
                <path d="M23.2384325,20.6447688 C25.9714488,21.8622653 27.8995418,24.574266 27.9961932,27.7495405 L28,28 L12,28 C12,24.7173706 13.9569452,21.8941583 16.7621746,20.64472 C17.6594302,21.3354466 18.7820371,21.7458119 20,21.7458119 C21.2179629,21.7458119 22.3405698,21.3354466 23.2384325,20.6447688 Z M20.0942872,12 C22.3294629,12 24.1414309,13.8212767 24.1414309,16.0679353 C24.1414309,18.3145939 22.3294629,20.1358706 20.0942872,20.1358706 C17.8591115,20.1358706 16.0471436,18.3145939 16.0471436,16.0679353 C16.0471436,13.8212767 17.8591115,12 20.0942872,12 Z" id="Combined-Shape"></path>
            </g>
        </g>
    </svg>
);
OwnSvg.propTypes = {
    fill: PropTypes.string
};

export const UserDataIcon = ({ fill, ...rest }) => <Icon component={() => <OwnSvg fill={fill}/>} {...rest} />;
UserDataIcon.propTypes = {
    fill: PropTypes.string
};
 ```

2) Import custom icon to component:

    import { UserDataIcon } from './UserDataIcon';

TODO: Where to store common custom icons so they are reusable between bundles? In oskariui-bundle?
 */