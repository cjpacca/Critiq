with open("src/components/VitrinaDorada.tsx", "r") as f:
    code = f.read()

# I need the media type 'movie', 'tv', 'game', 'book', 'track'
# But cat.id is 'movies', 'series', 'games', 'books', 'music'.
# Let's add 'type' to VitrinaCategory interface and use it in the link.
code = code.replace("id: string;\n  title: string;", "id: string;\n  type: string;\n  title: string;")
code = code.replace("href={`/rate/${cat.id}", "href={`/rate/${cat.type}")

with open("src/components/VitrinaDorada.tsx", "w") as f:
    f.write(code)

with open("src/app/page.tsx", "r") as f:
    code = f.read()

code = code.replace("id: 'movies',", "id: 'movies',\n            type: 'movie',")
code = code.replace("id: 'series',", "id: 'series',\n            type: 'tv',")
code = code.replace("id: 'games',", "id: 'games',\n            type: 'game',")
code = code.replace("id: 'books',", "id: 'books',\n            type: 'book',")
code = code.replace("id: 'music',", "id: 'music',\n            type: 'track',")

# Also fix the top items IDs.
# For movies, tmdbId is what we need for the URL, not the uuid from the rating.
code = code.replace("id: m.movieId,", "id: m.movie.tmdbId.toString(),")
code = code.replace("id: s.seriesId,", "id: s.series.tmdbId.toString(),")
code = code.replace("id: g.gameId,", "id: g.game.rawgId,")
code = code.replace("id: b.bookId,", "id: b.book.googleId,")
code = code.replace("id: m.musicId,", "id: m.music.spotifyId,")

with open("src/app/page.tsx", "w") as f:
    f.write(code)
