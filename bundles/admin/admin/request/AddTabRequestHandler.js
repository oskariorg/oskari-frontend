/**
 * @class AddTabRequestHandler
 * Handles Admin.AddTabRequest by forwarding tab data to admin flyout.
 */
export class AddTabRequestHandler {
    constructor (flyout) {
        this.flyout = flyout;
    }

    handleRequest (core, request) {
        this.flyout.addTab({
            title: request.getTitle(),
            content: request.getContent(),
            priority: request.getPriority(),
            id: request.getId()
        });
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.admin.request.AddTabRequestHandler',
    AddTabRequestHandler,
    { protocol: ['Oskari.mapframework.core.RequestHandler'] }
);
