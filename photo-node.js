console.log("photo-node.js loaded");
class PhotoNode {
    constructor(photo) {
        this.data = photo;
        this.next = null;
    }
}

class PhotoLinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
    }

    insert(photo) {
        const node = new PhotoNode(photo);
        if (!this.head) {
            this.head = node;
            console.log("Added photo node");
        } else {
            let cur = this.head;
            while (cur.next) cur = cur.next;
            cur.next = node;
        }
        this.length++;
    }

    removeLast() {
        if (!this.head) return null;

        if (!this.head.next) {
            const removed = this.head.data;
            this.head = null;
            this.length--;
            console.log("Removed photo node");
            return removed;
        }

        let cur = this.head;
        while (cur.next.next) cur = cur.next;

        const removed = cur.next.data;
        cur.next = null;
        this.length--;
        return removed;
    }

    clear() {
        this.head = null;
        this.length = 0;
    }

    findById(id) {
        let cur = this.head;
        while (cur) {
            if (cur.data.id == id) return cur.data;
            cur = cur.next;
        }
        return null;
    }

    forEach(cb) {
        let cur = this.head;
        while (cur) {
            cb(cur.data);
            cur = cur.next;
        }
    }

    toArray() {
        const arr = [];
        this.forEach(p => arr.push(p));
        return arr;
    }
}