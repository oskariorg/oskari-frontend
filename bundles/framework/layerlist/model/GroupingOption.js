export class GroupingOption {
    constructor (key, title, method) {
        this.key = key;
        this.title = title;
        this.method = method;
    }

    getKey () {
        return this.key;
    }

    getTitle () {
        return this.title;
    }

    getMethod () {
        return this.method;
    }
};
