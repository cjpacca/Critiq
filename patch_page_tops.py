import re

with open("src/app/page.tsx", "r") as f:
    code = f.read()

# Add typeKeys
code = code.replace('title="Top Películas"', 'title="Top Películas"\n          typeKey="movies"')
code = code.replace('title="Top Series"', 'title="Top Series"\n          typeKey="series"')
code = code.replace('title="Top Canciones"', 'title="Top Canciones"\n          typeKey="music"')
code = code.replace('title="Top Libros"', 'title="Top Libros"\n          typeKey="books"')
code = code.replace('title="Top Juegos"', 'title="Top Juegos"\n          typeKey="games"')

with open("src/app/page.tsx", "w") as f:
    f.write(code)
