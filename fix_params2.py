with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "media = await getMediaDetails(id, type);",
    "media = await getMediaDetails(id, type as 'movie' | 'tv');"
)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)
