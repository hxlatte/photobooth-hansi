# 📸 Hansika's Photobooth ⭐
A fun browser-based photobooth app built using HTML, CSS, and JavaScript.  
This project focuses on JavaScript logic, webcam API usage, canvas manipulation, and localStorage.

---

## Introduction 
This is a cute and interactive photobooth web app inspired by real-life photo strip booths.  
The goal of this project was to practice:
- Accessing and displaying live webcam feed using the MediaDevices API  
- Capturing and cropping photos to canvas  
- Applying real-time CSS filters to video  
- Placing and dragging image stickers onto photos  
- Storing and passing photo data between pages using localStorage  

---

## Technologies Used 
- **HTML** – Structure of the three-page app (Home, Camera, Edit)  
- **CSS** – Styling, layout with CSS Grid, and filter animations  
- **JavaScript** – Webcam capture, canvas drawing, sticker system, and navigation  
- **Canvas API** – Capturing and cropping video frames into photo strips  
- **LocalStorage** – Passing captured photos between pages  
- **html2canvas** – Rendering the final photo strip with stickers as a downloadable image  

---

## Features 
- Live webcam preview on the home page  
- 3-photo strip capture with countdown timer (3s / 5s / 10s)  
- Real-time filters: B&W, Vintage, Soft, Vivid, Film, Dreamy, Moody  
- Drag-and-drop sticker placement on photos  
- Undo last sticker functionality  
- Download the final photo strip as a PNG  
- Upload your own photos instead of using the camera
  
---

##  How It Works
- **Home Page** – Shows a live camera preview with CAPTURE and UPLOAD options  
- **Camera Page** – Counts down and captures 3 photos into a photo strip with your chosen filter  
- **Edit Page** – Add stickers to your strip, drag them around, then download  

---

## What I Learned 
- Using `navigator.mediaDevices.getUserMedia` to access the webcam  
- Drawing and cropping video frames onto an HTML Canvas  
- Mirroring video with `transform: scaleX(-1)` and replicating it in canvas with `ctx.scale(-1, 1)`  
- Using CSS Grid for multi-column page layouts  
- Implementing drag-and-drop with both the HTML Drag API and mousedown/mousemove events  
- Using `html2canvas` to flatten layered HTML elements into a single downloadable image  
- Managing state and data across multiple HTML pages using localStorage  

---

## How to Run the Project 

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hansika-photobooth.git
   ```

2. Open the project folder:
   ```bash
   cd hansika-photobooth
   ```

3. Open `home.html` in your browser:
   - Simply double-click `home.html`, **or**
   - Use a local server (recommended for camera access):
     ```bash
     npx live-server
     ```

4. Allow camera permissions when prompted and start snapping! 

---

## Project Structure 
```
hansika-photobooth/
│
├── home.html          # Landing page with live camera preview
├── camera.html        # Photo capture page with timer and filters
├── edit.html          # Sticker editing and download page
├── style.css          # All styles across all pages
├── index.js           # All JavaScript logic
├── cat.png            # Decorative cat on home page
├── sticker1.png       # Sticker assets
├── sticker2.png
├── sticker3.png
├── sticker4.png
├── sticker5.png
├── sticker6.png
├── Group 6 (1).svg    # Checkerboard border decoration
└── fonts/
    └── SingleDay-Regular.ttf
```

---


## Credits 
- Font: **SingleDay** – Google Fonts  
- Sticker assets – custom collected images  
- Border design – custom SVG
- Built with love by **Hansika**
