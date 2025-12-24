
// Stack Undo Redo

function undoAdd() {
    if (!undoStack.length) return;

    const removed = photoList.removeLast();
    if (!removed) return;

    redoStack.push(removed);
    console.log("Removed photo node from stack");
    refreshUI();
}

function redoAdd() {
    if (!redoStack.length) return;

    const photo = redoStack.pop();
    photoList.insert(photo);
    undoStack.push(photo);
    console.log("Added photo node to stack");
    refreshUI();
}