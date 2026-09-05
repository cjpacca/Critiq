with open("src/app/layout.tsx", "r") as f:
    code = f.read()

code = code.replace('import { Providers } from "./Providers";\n', '')
code = code.replace('<Providers><LayoutWrapper>{children}</LayoutWrapper></Providers>', '<LayoutWrapper>{children}</LayoutWrapper>')

with open("src/app/layout.tsx", "w") as f:
    f.write(code)
