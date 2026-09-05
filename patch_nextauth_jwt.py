with open("src/app/api/auth/[...nextauth]/route.ts", "r") as f:
    code = f.read()

if "strategy:" not in code:
    code = code.replace(
        "adapter: PrismaAdapter(prisma),",
        "adapter: PrismaAdapter(prisma),\n  session: { strategy: 'jwt' },"
    )

with open("src/app/api/auth/[...nextauth]/route.ts", "w") as f:
    f.write(code)
