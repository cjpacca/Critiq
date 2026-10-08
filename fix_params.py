with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "params: Promise<{ type: 'movie'|'tv'|'track'|'album'|'book'|'game', id: string }>",
    "params: Promise<{ type: string, id: string }>"
)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)
