# Romantic Website for Bhavi

A luxury, minimal, Apple-inspired single-page romantic website built with HTML, Vanilla CSS, and JavaScript. The site includes a glassmorphic floating music player, interactive mouse glows, a customized particle background, and responsive galleries.

---

## 📂 Asset Placement Guide

Please place your high-quality media files in the designated paths within the `assets/` directory before deployment:

| Asset Filename | Directory Path | Description |
| :--- | :--- | :--- |
| **`hero.jpg`** | `assets/images/hero.jpg` | Full-screen hero background image. Suggest high-contrast, centered framing. |
| **`memory1.jpg`** | `assets/images/memory1.jpg` | First wide landscape memory image in the gallery. |
| **`memory2.jpg`** | `assets/images/memory2.jpg` | Second wide landscape memory image in the gallery. |
| **`memory3.jpg`** | `assets/images/memory3.jpg` | Third wide landscape memory image in the gallery. |
| **`memory4.jpg`** | `assets/images/memory4.jpg` | Fourth wide landscape memory image in the gallery. |
| **`song.jpg`** | `assets/images/song.jpg` | Photograph of the handwritten song. Keeps original ratio & unlocks fullscreen drag-and-zoom. |
| **`song.mp3`** | `assets/music/song.mp3` | The audio file for the floating player. Keeps play state & playback position saved. |

---

## 💻 How to Run Locally

Since the site uses canvas drawing, standard layout loading, and browser-safe HTML5 audio storage, it works best when served using a lightweight local web server.

### Option 1: Live Server (Recommended)
If using **VS Code**:
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **Open with Live Server**.
3. The page will launch automatically at `http://127.0.0.1:5500`.

### Option 2: Python HTTP Server (Zero Setup)
Open your terminal inside the project folder (`/Users/pranavdhingra/Projects/Bhaviiiiii`) and run:

- **Python 3:**
  ```bash
  python -m http.server 8000
  ```
- **Python 2:**
  ```bash
  python -m SimpleHTTPServer 8000
  ```

Then open `http://localhost:8000` in your web browser.

---

## 🚀 How to Deploy on GitHub Pages

You can host this website completely for free on GitHub Pages:

1. **Create a GitHub Repository**:
   - Create a new public repository on GitHub (e.g., `for-bhavi`).
2. **Push the Files to GitHub**:
   - Run these terminal commands to link and upload your code:
     ```bash
     git remote add origin https://github.com/YOUR_GITHUB_USERNAME/for-bhavi.git
     git branch -M main
     git push -u origin main
     ```
3. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub.
   - Click on the **Pages** tab on the left sidebar.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose the branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. **Access the Site**:
   - Within 1–2 minutes, your website will be live at:
     `https://YOUR_GITHUB_USERNAME.github.io/for-bhavi/`

---

## 📸 How to Update Images Later

To replace any images in the future, simply follow these steps:
1. Ensure the new image file is formatted as a `.jpg` (JPEG).
2. Save it with the **exact same filename** (e.g., `memory1.jpg`).
3. Replace the old file inside `assets/images/` with the new file.
4. Git commit and push the updated image:
   ```bash
   git add assets/images/
   git commit -m "Update memory photos"
   git push origin main
   ```
   GitHub Pages will automatically rebuild and serve the new images.

---

## ✨ Features Built-In

1. **6.5s Loading Animation Screen**: Types out the intro lines before elegantly shifting and fading with blur reveals.
2. **Smooth Parallax Scrolling**: The full-screen hero image scales and shifts coordinates synchronously with scroll speed.
3. **Smooth Scroll Revelations**: Sections, cards, text, and captions transition in using Intersection Observers for 60 FPS performance.
4. **Glassmorphism Tilt Cards**: The grids on Section 4 respond to mouse coordinates to rotate in 3D and draw highlight spotlights.
5. **Interactive Floating Music Widget**: Remembers playback state and shows a round visual ring tracking song duration progress.
6. **Double-Twinkling Star Canvas**: Section 7 draws canvas stars that flash at random speeds with shooting star streaks.
7. **Pinch-to-Zoom Modal**: Pinch or scroll zoom on the handwritten song image, enabling drag-to-pan movements.
8. **Aurora Animated Waves**: The bottom section displays slow-drifting multicolor radial gradients mimicking polar auroras.
9. **Gold Heart Particle Outro Burst**: When clicking the final button, the page explodes with gold hearts/sparks and types out:
   *"Take care of yourself. Always."*
