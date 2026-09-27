# Critiq 🌟

**Critiq** is a beautiful, blazing-fast, and 100% offline desktop application designed to be your ultimate personal media tracker. Rate, track, and visualize your journey through Movies, TV Shows, Video Games, Books, and Music.

Forget about cloud latency, servers, or subscriptions. Critiq runs entirely on your local machine using Electron and SQLite, keeping your data strictly yours.

## ✨ Features

*   **Universal Tracking:** Unify your media consumption. Rate Movies, Series, Video Games, Books, Music Albums, and even individual TV Episodes or Songs.
*   **Granular Rating System (1000-point scale):** Go beyond 5 stars. Rate media based on specific categories (e.g., Gameplay, Graphics, and Story for games; Pacing, Acting, and Plot for movies).
*   **Stunning Visualizations:**
    *   🕸️ **Digital Fingerprint (Spider Charts):** Watch your rating profile morph in real-time as you drag the sliders.
    *   🔥 **Global Heatmap:** A GitHub-style contribution calendar mapping your daily media consumption over the last year.
    *   🏆 **Completionism Medals:** Animated CSS badges for your gaming milestones (Silver, Gold, Platinum).
    *   📈 **Season Progress Graphs:** Line charts plotting TV show quality episode by episode.
*   **100% Offline & Private:** Powered by a local SQLite database (`critiq.db`). No accounts required.

## 🚀 Getting Started

Critiq is cross-platform and will seamlessly run on Windows, macOS, and Linux.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/critiq.git
   cd critiq
   ```

2. **Run the App:**
   We've included automated scripts that will install dependencies, set up the local database, and launch the application for you.

   *   **Windows:** Double-click on `start.bat`
   *   **Linux / macOS:** Run the bash script in your terminal:
       ```bash
       chmod +x start.sh
       ./start.sh
       ```

*(Note: The first launch might take a minute as it downloads npm packages and initializes the SQLite database).*

## 🛠️ Built With

*   [Next.js App Router](https://nextjs.org/) - UI & React Framework
*   [Electron](https://www.electronjs.org/) - Desktop Native Wrapper
*   [Tailwind CSS](https://tailwindcss.com/) - Styling & Animations
*   [Prisma](https://www.prisma.io/) & SQLite - Local Database
*   [Recharts](https://recharts.org/) - Data Visualizations
