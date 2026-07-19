# Romantic Storytelling Website for Bhavi

A luxury, minimal, Apple-inspired single-page romantic website built like an elegant storytelling book. It features edge-to-edge mobile imagery, a custom polaroid call frame, a fullscreen picture zoom transition, double-stacked open diary pages, and a cinematic outro with dual-choice glassmorphic buttons.

---

## 📂 Asset Placement Guide

Please place your high-quality media files inside the `assets/` folder using the exact filenames and paths listed below before deploying:

| Asset Filename | Directory Path | Description |
| :--- | :--- | :--- |
| **`hero.jpeg`** | `assets/images/hero.jpeg` | Full-screen hero background image. |
| **`memory1.jpeg`** | `assets/images/memory1.jpeg` | Section: "Our First Chapter" |
| **`memory2.jpeg`** | `assets/images/memory2.jpeg` | Section: "The Days I'll Always Smile About" |
| **`memory3.jpeg`** | `assets/images/memory3.jpeg` | Section: "The Version Of Us I Never Want To Forget" |
| **`memory4.jpeg`** | `assets/images/memory4.jpeg` | Section: "One Of My Favourite Memories" (Video call kiss screenshot) |
| **`memory5.jpeg`** | `assets/images/memory5.jpeg` | Section: "My Favourite Picture Of You" (Fullscreen blurred background zoom) |
| **`song1.jpeg`** | `assets/images/song1.jpeg` | Birthday Song Page 1 (Open diary page) |
| **`song2.jpeg`** | `assets/images/song2.jpeg` | Birthday Song Page 2 (Open diary page) |
| **`final-memory.mp4`** | `assets/videos/final-memory.mp4` | 18-second cinematic climax video (contains original audio) |

*Note: The website is completely silent by design until the final video is viewed. There is no background audio (`song.mp3` is not used).*

---

## 💻 How to Run Locally

Since the site uses canvas drawing, scroll observers, and video media endpoints, serve it using a local web server.

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

1. **Push your code to GitHub**:
   - Link your local repository to your remote branch and push:
     ```bash
     git remote add origin https://github.com/pranavdhingra/Bhaviiiiii.git
     git branch -M main
     git push -u origin main
     ```
2. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub.
   - Click on the **Pages** tab on the left sidebar.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose the branch **`main`** and folder **`/ (root)`**, then click **Save**.
3. **Access the Site**:
   - Within 1–2 minutes, your website will be live at:
     `https://pranavdhingra.github.io/Bhaviiiiii/`

---

## 📸 How to Update Images Later

To replace any images in the future:
1. Format the new image as a `.jpeg` or video as an `.mp4`.
2. Save it with the **exact same filename** (e.g., `memory1.jpeg`).
3. Replace the old file inside `assets/images/` or `assets/videos/` with the new file.
4. Git commit and push the updated image:
   ```bash
   git add assets/
   git commit -m "Update gallery assets"
   git push origin main
   ```
   GitHub Pages will automatically rebuild and serve the new images.
