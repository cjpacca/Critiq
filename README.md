# 🌌 Critiq (Local Desktop Edition)

> **A unified, highly-granular media tracker and social rating platform.**

Critiq is a full-stack application designed to run entirely locally on your PC. It tracks, rates, and analyzes your favorite Movies, TV Shows, Video Games, Books, and Music Albums using a granular 1000-point scale. **All your data is saved privately on your hard drive** via an ultra-fast local SQLite database.

## ✨ Features

- **100% Local & Private:** No cloud dependencies, no accounts required. Everything stays on your machine.
- **Universal Library:** Track Movies & TV (TMDB), Video Games (RAWG), Books (Google Books), and Music/Albums (iTunes).
- **Granular Scoring System:** Rate media based on specific metrics (Cinematography, Gameplay, Immersion) to calculate a definitive score out of 1000.
- **Advanced Personal Analytics:** Track your total gaming hours, binge-watching days, pages read, and global average scores across all mediums.
- **Sequential Tracking:** Use *Seriesgraph* to track individual TV episodes, and *Trackgraph* to rate individual songs within an album.
- **Dynamic UI:** Features a premium "Dark Glassmorphism" aesthetic with dynamic UI colors extracted directly from media posters using ColorThief.

## 🚀 Easy Installation (Windows, Mac & Linux)

Critiq is designed to be plug-and-play. The only requirement is having [Node.js](https://nodejs.org/) (v20 or higher) installed on your computer.

### 1. Download the Project
Clone or download this repository as a `.zip` file and extract it.

### 2. Configure APIs
Rename the `.env.example` file to `.env` (or create one) in the `webapp` folder, and add your free TMDB API key:
```env
TMDB_API_KEY="your_tmdb_api_key_here"
```

### 3. Run with 1-Click
Navigate into the `webapp` folder and double-click the startup script for your operating system:

- **Windows:** Double-click `start.bat`
- **Mac / Linux:** Run `start.sh` in your terminal (or double-click it if your system allows running shell scripts).

*The script will automatically install dependencies, initialize your local database, start the server, and open your browser at `http://localhost:3000`!*

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Database:** SQLite (Local) via [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Lucide React
- **Data Visualization:** Recharts

## 👥 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
