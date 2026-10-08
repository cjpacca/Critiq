with open("src/components/VitrinaDorada.tsx", "r") as f:
    code = f.read()

# Fix VitrinaItem
code = code.replace("export interface VitrinaItem {\n  id: string;\n  type: string;\n  title: string;", "export interface VitrinaItem {\n  id: string;\n  title: string;")

with open("src/components/VitrinaDorada.tsx", "w") as f:
    f.write(code)
