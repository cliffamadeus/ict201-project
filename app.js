console.log("Script Added");

/* ================= GLOBALS ================= */
const photoList = new PhotoLinkedList();
const undoStack = [];
const redoStack = [];

let markers = [];
let areaPolygon = null;

const myMap = L.map('map').setView([11.63523, 123.7079], 5);
const spinner = document.getElementById("loadingSpinner");

/* ================= MAP ================= */

function initMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(myMap);
}

document.addEventListener("DOMContentLoaded", initMap);

/* ================= UI ================= */

function refreshUI() {
    updatePhotoCards();
    drawPaths();
    updateTimeDiff();
    renderNodeGraph(); 
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
    if (areaPolygon) myMap.removeLayer(areaPolygon);


    photoList.clear();
    undoStack.length = 0;
    redoStack.length = 0;

    document.getElementById("photoCards").innerHTML = "";
    document.getElementById("timeInfo").style.display = "none";

    if (reset) document.getElementById("imageInput").value = "";
    myMap.setView([11.63523, 123.7079], 5);

    d3.select("#nodeGraph").selectAll("*").remove();

}