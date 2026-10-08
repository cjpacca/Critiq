with open("src/app/tops/TopsClient.tsx", "r") as f:
    code = f.read()

old_poster_logic = "const poster = mediaData.posterUrl ? (mediaData.posterUrl.startsWith('/') ? mediaData.posterUrl : `https://image.tmdb.org/t/p/w200${mediaData.posterUrl}`) : '';"

new_poster_logic = "const poster = mediaData.posterUrl ? (mediaData.posterUrl.startsWith('/') ? `https://image.tmdb.org/t/p/w300${mediaData.posterUrl}` : mediaData.posterUrl) : '';"

code = code.replace(old_poster_logic, new_poster_logic)

with open("src/app/tops/TopsClient.tsx", "w") as f:
    f.write(code)
