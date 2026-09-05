import re

with open("src/app/actions/tmdb.ts", "r") as f:
    code = f.read()

# Append credits
code = code.replace(
    "`${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-ES`",
    "`${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`"
)

with open("src/app/actions/tmdb.ts", "w") as f:
    f.write(code)
