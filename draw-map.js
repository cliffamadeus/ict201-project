
function focusOnPhoto(id) {
    const p = photoList.findById(id);
    if (!p) return;

    myMap.setView([p.lat, p.lon], 15);
    const m = markers.find(x => x.photoId == id);
    if (m) m.openPopup();
}

async function drawPaths() {
    // Clear old layers
    markers.forEach(m => myMap.removeLayer(m));
    markers = [];
    if (areaPolygon) myMap.removeLayer(areaPolygon);

    const arr = photoList.toArray();
    if (!arr.length) return;

    // Sort by time (optional but useful)
    arr.sort((a, b) => (a.dateObj || 0) - (b.dateObj || 0));

    // Add markers
    arr.forEach(p => {
        const m = L.marker([p.lat, p.lon])
            .addTo(myMap)
            .bindPopup(`<b>${p.filename}</b><br>${p.formattedDate}`);
        m.photoId = p.id;
        markers.push(m);
    });

    // Need at least 3 points for polygon
    if (arr.length < 3) return;

    // Convert to [lat, lon]
    const points = arr.map(p => [p.lat, p.lon]);

    // Compute convex hull
    const hull = convexHull(points);

    // Draw polygon
    areaPolygon = L.polygon(hull, {
        color: "green",
        fillColor: "#3cb371",
        fillOpacity: 0.3,
        weight: 3
    }).addTo(myMap);

    myMap.fitBounds(areaPolygon.getBounds());
}

function convexHull(points) {
    if (points.length <= 3) return points;

    // Sort points by latitude, then longitude
    points = points.slice().sort((a, b) =>
        a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
    );

    const cross = (o, a, b) =>
        (a[0] - o[0]) * (b[1] - o[1]) -
        (a[1] - o[1]) * (b[0] - o[0]);

    const lower = [];
    for (const p of points) {
        while (lower.length >= 2 &&
            cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
            lower.pop();
        }
        lower.push(p);
    }

    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (upper.length >= 2 &&
            cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
            upper.pop();
        }
        upper.push(p);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}
