# Photo EXIF Linked List Visualizer

A web-based application built with **HTML, CSS, and JavaScript** that extracts **EXIF metadata from photos**, stores the data using a **Linked List data structure**, and visualizes the structure using **D3.js**. The project includes a lightweight development server powered by **npm live-server** for real-time preview.

---

## 🚀 Features

* 📷 **Photo EXIF Extraction**

  * Reads EXIF metadata from uploaded images
  * Parses common EXIF fields (camera model, date, orientation, etc.)

* 🔗 **Linked List Data Structure**

  * Each EXIF entry is stored as a node in a linked list
  * Demonstrates traversal and node connections in real time

* 📊 **D3.js Visualization**

  * Visualizes linked list nodes and pointers
  * Interactive node layout for better understanding of data flow

* ⚡ **Live Preview**

  * Uses `live-server` for automatic reload on file changes

---

## 🛠️ Tech Stack

* **HTML5** – Application structure
* **CSS3** – Styling and layout
* **JavaScript (ES6)** – Logic, data structures, EXIF processing
* **D3.js** – Linked list node visualization
* **npm live-server** – Local development server

---

## 📂 Project Structure

```
project-root/
│
├── index.html        # Main HTML file
├── styles/
│   └── style.css     # Application styling
├── scripts/
│   ├── linkedList.js # Linked list implementation
│   ├── exif.js       # EXIF extraction logic
│   └── visualize.js  # D3.js visualization
├── assets/           # Sample images (optional)
├── package.json
└── README.md
```

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/cliffamadeus/ict201-project.git
cd photo-exif-linked-list
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npx live-server
```

The application will open automatically in your default browser.

---

## 🧠 How It Works

1. User uploads an image file
2. EXIF metadata is extracted from the image
3. Each metadata entry is inserted as a node in a linked list
4. D3.js renders the linked list visually with connected nodes
5. Any update to the data structure is reflected in real time

---

## 📊 Visualization Details

* Nodes represent EXIF metadata entries
* Links represent `next` pointers in the linked list
* D3 force/layout algorithms are used for clarity and spacing

---

## 🔮 Future Improvements

* Support for multiple images
* Doubly linked list or tree visualization
* Export EXIF data as JSON
* Zoom and pan interactions in D3 visualization

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Cliff Amadeus F Evangelio**
Feel free to fork, modify, and contribute!

