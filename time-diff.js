// Time
function updateTimeDiff() {
    const arr = photoList.toArray().filter(p => p.dateObj);
    if (arr.length < 2) return;

    arr.sort((a, b) => a.dateObj - b.dateObj);

    const diffMs = Math.abs(arr[arr.length - 1].dateObj - arr[0].dateObj);

    document.getElementById("timeDifference").innerText =
        formatDuration(diffMs);

    document.getElementById("timeInfo").style.display = "block";
}

function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const minutes = totalMinutes % 60;

    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;

    const days = Math.floor(totalHours / 24);

    let parts = [];

    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0 || parts.length === 0)
        parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

    return parts.join(" ");
}
