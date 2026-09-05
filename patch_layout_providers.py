with open("src/app/layout.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "<LayoutWrapper><Providers>{children}</Providers></LayoutWrapper>",
    "<Providers><LayoutWrapper>{children}</LayoutWrapper></Providers>"
)

with open("src/app/layout.tsx", "w") as f:
    f.write(code)
