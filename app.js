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

/* ================= GLOBALS ================= */

const photoList = new PhotoLinkedList();
const undoStack = [];
const redoStack = [];

let markers = [];
let pathPolyline = null;

const myMap = L.map('map').setView([11.63523, 123.7079], 5);
const spinner = document.getElementById("loadingSpinner");

/* ================= MAP ================= */

function initMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(myMap);
}

document.addEventListener("DOMContentLoaded", initMap);

/* ================= IMAGE INPUT ================= */

async function handleImageInput(input) {
    if (!input.files.length) return;

    spinner.style.display = "block";

    for (const file of input.files) {
        await processImage(file);
    }

    spinner.style.display = "none";
    refreshUI();
}

function processImage(file) {
    return new Promise(resolve => {
        const reader = new FileReader();

        reader.onload = e => {
            EXIF.getData(file, function () {

                const lat = EXIF.getTag(this, "GPSLatitude");
                const lon = EXIF.getTag(this, "GPSLongitude");
                if (!lat || !lon) return resolve();

                const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
                const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "W";

                const calcLat = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef === "N" ? 1 : -1);
                const calcLon = (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef === "W" ? -1 : 1);

                let dateObj = null;
                const date = EXIF.getTag(this, "DateTimeOriginal");
                if (date) {
                    const [d,t] = date.split(" ");
                    dateObj = new Date(d.replace(/:/g,"-") + "T" + t);
                }

                const photo = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    lat: calcLat,
                    lon: calcLon,
                    dateObj,
                    filename: file.name,
                    formattedDate: dateObj ? dateObj.toLocaleString() : "Unknown"
                };

                photoList.insert(photo);
                undoStack.push(photo);
                redoStack.length = 0;

                resolve();
            });
        };

        reader.readAsDataURL(file);
    });
}

/* ================= UNDO / REDO ================= */

function undoAdd() {
    if (!undoStack.length) return;

    const removed = photoList.removeLast();
    if (!removed) return;

    redoStack.push(removed);
    refreshUI();
}

function redoAdd() {
    if (!redoStack.length) return;

    const photo = redoStack.pop();
    photoList.insert(photo);
    undoStack.push(photo);
    refreshUI();
}

/* ================= UI ================= */

function refreshUI() {
    updatePhotoCards();
    drawPaths();
    updateTimeDiff();
}

function updatePhotoCards() {
    const container = document.getElementById("photoCards");
    container.innerHTML = "";

    photoList.forEach(p => {
        const card = document.createElement("div");
        card.className = "photo-card";
        card.onclick = () => focusOnPhoto(p.id);

        card.innerHTML = `
            <div class="row">
                <div class="col-4">
                    <img src="${p.src}" class="fixed-img">
                </div>
                <div class="col-8">
                    <strong>${p.filename}</strong><br>
                    ${p.formattedDate}<br>
                    <small>${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}</small>
                    <hr>
                </div>
                
            </div>
            
            
        `;

        container.appendChild(card);
    });
}

/* ================= MAP DRAW ================= */

function focusOnPhoto(id) {
    const p = photoList.findById(id);
    if (!p) return;

    myMap.setView([p.lat, p.lon], 15);
    const m = markers.find(x => x.photoId == id);
    if (m) m.openPopup();
}

async function drawPaths() {
    markers.forEach(m => myMap.removeLayer(m));
    markers = [];
    if (pathPolyline) myMap.removeLayer(pathPolyline);

    const arr = photoList.toArray();
    if (!arr.length) return;

    arr.sort((a,b) => (a.dateObj || 0) - (b.dateObj || 0));

    arr.forEach(p => {
        const m = L.marker([p.lat, p.lon])
            .addTo(myMap)
            .bindPopup(`<b>${p.filename}</b><br>${p.formattedDate}`);
        m.photoId = p.id;
        markers.push(m);
    });

    if (arr.length < 2) return;

    const coords = arr.map(p => `${p.lon},${p.lat}`).join(";");

    try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        const data = await res.json();
        const path = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        pathPolyline = L.polyline(path, {color:"blue", weight:4}).addTo(myMap);
        myMap.fitBounds(pathPolyline.getBounds());
    } catch {
        const fallback = arr.map(p => [p.lat, p.lon]);
        pathPolyline = L.polyline(fallback, {color:"red"}).addTo(myMap);
        myMap.fitBounds(pathPolyline.getBounds());
    }
}

/* ================= TIME ================= */

function updateTimeDiff() {
    const arr = photoList.toArray().filter(p => p.dateObj);
    if (arr.length < 2) return;

    arr.sort((a,b) => a.dateObj - b.dateObj);
    const diff = Math.abs(arr[arr.length-1].dateObj - arr[0].dateObj);
    const mins = Math.floor(diff / 60000);

    document.getElementById("timeDifference").innerText = mins + " minutes";
    document.getElementById("timeInfo").style.display = "block";
}

/* ================= CLEAR ================= */

function clearMap(reset = true) {
    markers.forEach(m => myMap.removeLayer(m));
    markers = [];
    if (pathPolyline) myMap.removeLayer(pathPolyline);

    photoList.clear();
    undoStack.length = 0;
    redoStack.length = 0;

    document.getElementById("photoCards").innerHTML = "";
    document.getElementById("timeInfo").style.display = "none";

    if (reset) document.getElementById("imageInput").value = "";
    myMap.setView([11.63523, 123.7079], 5);
}
