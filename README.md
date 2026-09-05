# 🌌 Critiq

> **A unified, highly-granular media tracker and social rating platform.**

Critiq is a full-stack web application designed for power users who want more than just a 5-star rating system. It allows you to track, rate, and analyze your favorite Movies, TV Shows, Video Games, Books, and Music Albums using a granular 1000-point scale based on specific technical and artistic criteria.

![Critiq Dashboard Preview](https://via.placeholder.com/1000x500.png?text=Critiq+Media+Tracker) <!-- Replace with actual screenshot later -->

## ✨ Features

- **Universal Library:** Track Movies & TV (via TMDB), Video Games (via RAWG), Books (via Google Books), and Music/Albums (via iTunes).
- **Granular Scoring System:** Rate media based on specific metrics (e.g., Cinematography, Writing, Gameplay, Immersion) to calculate a definitive score out of 1000 points.
- **Advanced Personal Analytics:** Track your total gaming hours, binge-watching days, pages read, and global average scores across all mediums.
- **Taste Match & Social Profiles:** Add friends, visit their public profiles, and use the mathematical **"Taste Match"** engine to calculate your affinity percentage based on shared media ratings.
- **Deep Metadata & Wikidata:** Asynchronously fetches rich metadata directly from Wikidata (directors, platforms, engines) and displays global community insights.
- **Dynamic UI:** Features a premium "Dark Glassmorphism" aesthetic with dynamic UI colors extracted directly from media posters using ColorThief.
- **Sequential Tracking:** Use *Seriesgraph* to track individual TV episodes per season, and *Trackgraph* to rate individual songs within an album.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Lucide React Icons
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **Data Visualization:** Recharts

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/critiq.git
cd critiq/webapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the necessary API keys and database URLs:
```env
# Database (Supabase)
DATABASE_URL="postgresql://user:password@aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@aws-0-pooler.supabase.com:5432/postgres"

# APIs
TMDB_API_KEY="your_tmdb_api_key"
# SPOTIFY_CLIENT_ID="your_spotify_client_id" (Optional)
# SPOTIFY_CLIENT_SECRET="your_spotify_client_secret" (Optional)
```

### 4. Setup Database
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

### 5. Run the Application
You can use the provided quick-start script (Linux/macOS) or run it manually:
```bash
# Using the launcher script
./iniciar_critiq.sh

# Or manually
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👥 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
