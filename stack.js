function undoAdd() {
    if (!undoStack.length) {
        console.log("Undo stack is empty");
        return;
    }

    const removed = photoList.removeLast();
    if (!removed) return;

    redoStack.push(removed);
    console.log("Undo: pushed to redoStack:", removed.filename);
    console.log("UndoStack length:", undoStack.length, "RedoStack length:", redoStack.length);
    refreshUI();
}

function redoAdd() {
    if (!redoStack.length) {
        console.log("Redo stack is empty");
        return;
    }

    const photo = redoStack.pop();
    console.log("Redo: popped from redoStack:", photo.filename);

    photoList.insert(photo);
    undoStack.push(photo);
    console.log("Redo: pushed to undoStack:", photo.filename);
    console.log("UndoStack length:", undoStack.length, "RedoStack length:", redoStack.length);

    refreshUI();
}function undoAdd() {
    if (!undoStack.length) {
        console.log("Undo stack is empty");
        return;
    }

    const removed = photoList.removeLast();
    if (!removed) return;

    redoStack.push(removed);
    console.log("Undo: pushed to redoStack:", removed.filename);
    console.log("UndoStack length:", undoStack.length, "RedoStack length:", redoStack.length);
    refreshUI();
}

function redoAdd() {
    if (!redoStack.length) {
        console.log("Redo stack is empty");
        return;
    }

    const photo = redoStack.pop();
    console.log("Redo: popped from redoStack:", photo.filename);

    photoList.insert(photo);
    undoStack.push(photo);
    console.log("Redo: pushed to undoStack:", photo.filename);
    console.log("UndoStack length:", undoStack.length, "RedoStack length:", redoStack.length);

    refreshUI();
}