import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './src/global';

configure({ adapter: new Adapter() });

const originalConsoleError = console.error;
console.error = message => {
    if (/(Failed prop type)/.test(message)) {
        throw new Error(message);
    }
    originalConsoleError(message);
};
