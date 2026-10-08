with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

code = code.replace("const userRating = await getUserRating(type, id);", "const userRating = await getUserRating(type as any, id);")

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)
