
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