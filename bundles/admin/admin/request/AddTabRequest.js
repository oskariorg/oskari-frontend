/**
 * @class AddTabRequest
 * Requests a tab to be added to admin flyout.
 */
export const ADD_TAB_NAME = 'Admin.AddTabRequest';

export class AddTabRequest {
    constructor (title, content, priority, id) {
        this._title = title;
        this._content = content;
        this._priority = priority;
        this._id = id;
    }

    getName () {
        return ADD_TAB_NAME;
    }

    getTitle () {
        return this._title;
    }

    getContent () {
        return this._content;
    }

    getPriority () {
        return this._priority;
    }

    getId () {
        return this._id;
    }
}

AddTabRequest.NAME = ADD_TAB_NAME;

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.admin.request.AddTabRequest',
    AddTabRequest,
    { protocol: ['Oskari.mapframework.request.Request'] }
);
