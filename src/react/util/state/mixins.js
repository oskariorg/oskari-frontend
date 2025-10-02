import { Controller } from './Controller';

/**
 * An easy way to add Controller to an UIHandler. Adds getController function to the UI handler.
 * The mixin takes Controller constructor parameters as parameter.
 *
 * @mixin controllerMixin
 * @mixes Controller
 * @example
 * // LoadingHandler.js
 * class UIHandler extends StateHandler {
 *      setLoading (loading) {
 *          this.updateState({ loading });
 *      }
 * };
 * export const LoadingHandler = controllerMixin(UIHandler, ['setLoading']);
 *
 * // LoadingButton.jsx
 * export const LoadingButton = ({loading, controller}) => (
 *     <div>
 *         { loading && <Spin /> }
 *         <Button onClick={() => controller.setLoading(!loading)}>
 *     </div>
 * );
 *
 * // View.js
 * export class View {
 *     constructor () {
 *         this.loadingHandler = new LoadingHandler();
 *         this.loadingHandler.addStateListener(() => this.render());
 *     }
 *     render () {
 *         const state = this.loadingHandler.getState();
 *         const controller = this.loadingHandler.getController();
 *         this.getReactRoot(document).render(<LoadingButton loading={state.loading} controller={controller} />);
 *     }
 * }
 */
export const controllerMixin = (UIHandler, functionNames = []) => {
    class HandlerWithController extends UIHandler {
        constructor (...args) {
            super(...args);
            let methods = functionNames;
            if (!Array.isArray(methods) || methods.length === 0) {
                methods = [];
                Oskari.log().warn('Controller does not have any methods!');
            }
            this.controller = new Controller(this, methods);
        }
        /**
         * @return {Controller} Controller for the handler
         */
        getController () {
            return this.controller;
        }
    }
    return HandlerWithController;
};
