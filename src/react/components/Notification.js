import { notification } from 'antd';
import 'antd/es/notification/style/index.js';
/**
 * Function to open antd notification to desired location.
 * Should be called from useEffect in React components.
 */
export const openNotification = (type, options) => {
    notification[type](options);
};
