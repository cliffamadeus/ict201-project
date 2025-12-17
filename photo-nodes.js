
class PhotoNode {
    constructor(photo) {
        this.data = photo;
        this.next = null;
        console.log("Created PhotoNode:", photo.filename);
    }
}

class PhotoLinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
        console.log("Initialized empty PhotoLinkedList");
    }

    insert(photo) {
        const node = new PhotoNode(photo);
        if (!this.head) {
            this.head = node;
            console.log("Inserted as head:", photo.filename);
        } else {
            let cur = this.head;
            while (cur.next) cur = cur.next;
            cur.next = node;
            console.log("Inserted at end:", photo.filename);
        }
        this.length++;
         console.log("LinkedList length:", this.length);
    }

    removeLast() {
        if (!this.head) 
            console.log("removeLast called on empty list");
            return null;

        if (!this.head.next) {
            const removed = this.head.data;
            this.head = null;
            this.length--;
            console.log("Removed last node (head):", removed.filename);
            return removed;
        }

        let cur = this.head;
        while (cur.next.next) cur = cur.next;

        const removed = cur.next.data;
        cur.next = null;
        this.length--;
        console.log("Removed last node:", removed.filename);
        console.log("LinkedList length:", this.length);
        return removed;
    }

    clear() {
        console.log("Clearing linked list. Previous length:", this.length);
        this.head = null;
        this.length = 0;
    }

     findById(id) {
        let cur = this.head;
        while (cur) {
            if (cur.data.id == id) {
                console.log("Found node by ID:", cur.data.filename);
                return cur.data;
            }
            cur = cur.next;
        }
        console.log("Node not found for ID:", id);
        return null;
    }

    forEach(cb) {
        let cur = this.head;
        while (cur) {
            console.log("Visiting node:", cur.data.filename);
            cb(cur.data);
            cur = cur.next;
        }
    }

    toArray() {
        const arr = [];
        this.forEach(p => arr.push(p));
        console.log("LinkedList toArray:", arr.map(p => p.filename));
        return arr;
    }
}