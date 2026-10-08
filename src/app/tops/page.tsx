import { PrismaClient } from "@prisma/client";
import { TopsClient } from "./TopsClient";

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function TopsPage({ searchParams }: { searchParams: { tab?: string } }) {
    // Note: searchParams is an async promise in Next.js 15, but we are on Next 14 here, though in some setups it requires await. We'll handle tab in client component gracefully.
    
    const [movies, series, games, books, music] = await Promise.all([
        prisma.movieRating.findMany({ orderBy: { totalScore: 'desc' }, include: { movie: true } }),
        prisma.seriesRating.findMany({ orderBy: { totalScore: 'desc' }, include: { series: true } }),
        prisma.gameRating.findMany({ orderBy: { totalScore: 'desc' }, include: { game: true } }),
        prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, include: { book: true } }),
        prisma.musicRating.findMany({ orderBy: { totalScore: 'desc' }, include: { music: true } }),
    ]);

    return (
      <div className="animate-in fade-in duration-700 max-w-6xl mx-auto mt-4">
        <TopsClient 
            initialTab={searchParams.tab || 'movies'} 
            movies={movies} 
            series={series} 
            games={games} 
            books={books} 
            music={music} 
        />
      </div>
    );
}
