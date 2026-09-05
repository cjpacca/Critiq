import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

code = code.replace("communityStats._avg as any", "(communityStats._avg as any)")
code = code.replace("communityStats._avg.", "(communityStats._avg as any).")
code = code.replace("(communityStats._avg as any).?", "(communityStats._avg as any)?.")

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)
