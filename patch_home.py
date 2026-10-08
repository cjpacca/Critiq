import re

with open("src/app/page.tsx", "r") as f:
    code = f.read()

# Import VitrinaDorada
code = code.replace('import { RankingColumn } from "@/components/RankingColumn";', 'import { VitrinaDorada } from "@/components/VitrinaDorada";')

# Define the categories array structure inside Home component
categories_code = """      {/* Vitrina Dorada (Reemplaza los RankingColumns) */}
      <VitrinaDorada 
        categories={[
          {
            id: 'movies',
            title: 'Top Películas',
            icon: Film,
            color: mediaColors.movies,
            items: topMovies.map(m => ({
              id: m.movieId,
              title: m.movie.title,
              poster: `https://image.tmdb.org/t/p/w300${m.movie.posterUrl}`,
              backdrop: (m.movie.raw_metadata as any)?.backdrop_path ? `https://image.tmdb.org/t/p/w780${(m.movie.raw_metadata as any).backdrop_path}` : null,
              score: m.totalScore
            }))
          },
          {
            id: 'series',
            title: 'Top Series',
            icon: Tv,
            color: mediaColors.series,
            items: topSeries.map(s => ({
              id: s.seriesId,
              title: s.series.title,
              poster: `https://image.tmdb.org/t/p/w300${s.series.posterUrl}`,
              backdrop: (s.series.raw_metadata as any)?.backdrop_path ? `https://image.tmdb.org/t/p/w780${(s.series.raw_metadata as any).backdrop_path}` : null,
              score: s.totalScore
            }))
          },
          {
            id: 'games',
            title: 'Top Juegos',
            icon: Gamepad2,
            color: mediaColors.games,
            imageClass: "w-20 h-28 aspect-[3/4] rounded-lg",
            items: topGames.map(g => ({
              id: g.gameId,
              title: g.game.title,
              poster: g.game.posterUrl || "",
              score: g.totalScore
            }))
          },
          {
            id: 'books',
            title: 'Top Libros',
            icon: BookOpen,
            color: mediaColors.books,
            imageClass: "w-20 h-28 aspect-[2/3] rounded-lg",
            items: topBooks.map(b => ({
              id: b.bookId,
              title: b.book.title,
              subtitle: b.book.author,
              poster: b.book.posterUrl || "",
              score: b.totalScore
            }))
          },
          {
            id: 'music',
            title: 'Top Canciones',
            icon: Music,
            color: mediaColors.music,
            imageClass: "w-24 h-24 rounded-full aspect-square",
            items: topMusic.map(m => ({
              id: m.musicId,
              title: m.music.title,
              subtitle: m.music.artist,
              poster: m.music.posterUrl || "",
              score: m.totalScore
            }))
          }
        ]} 
      />"""

# Extract the old section 
old_section_regex = r'\{\/\* Leaderboards Espectaculares \*\/\}.*?<\/section>'
code = re.sub(old_section_regex, categories_code, code, flags=re.DOTALL)

with open("src/app/page.tsx", "w") as f:
    f.write(code)
