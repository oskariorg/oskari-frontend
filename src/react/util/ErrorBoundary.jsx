import React from 'react';
import PropTypes from 'prop-types';
import { getMsg } from './locale';

const DefaultError = () => (<h1>{getMsg('error.generic')}</h1>);
/**
 * Usage:
 * 1) Wrap components to "try/catch" with:
 *
 *     import { ErrorBoundary } from 'oskari-ui/util';
 *     <ErrorBoundary> .. the usual JSX ... </ErrorBoundary>
 *
 * 2) (optional) Create custom error handler to show when error happens on wrapped components:
 *
 *      export const CustomError = ({info}) => {
 *          console.log(info);
 *          return (<b>BOOM!</b>);
 *      };
 *
 * 3) (optional) Pass custom error element for customizing the error display:
 *
 *     import {CustomError} from './CustomError';
 *     <ErrorBoundary errorComponent={CustomError}>
 *
 * 4) See more:
 * - https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.errorComp = props.errorComponent;
        this.state = { hasError: false };
    }

    componentDidCatch (error, errorInfo) {
        this.setState({
            hasError: true,
            errorInfo });
        Oskari.log('React/ErrorBoundary').error(error, errorInfo);
    }

    render () {
        if (this.state.hasError) {
            const ErrorComp = this.errorComp || DefaultError;
            return (<ErrorComp info={this.state.errorInfo}/>);
        }
        return this.props.children;
    }
}
ErrorBoundary.propTypes = {
    children: PropTypes.node,
    errorComponent: PropTypes.elementType
};
