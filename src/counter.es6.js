
let _count = new WeakMap();

export default class Sequence {
    constructor() {
        _count.set(this, 0);
    }
    curVal() {
        return _count.get(this);
    }
    nextVal() {
        let count = this.curVal();
        count++;
        _count.set(this, count);
        return count;
    }
}