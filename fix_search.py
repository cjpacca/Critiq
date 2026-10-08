with open("src/components/SearchUI.tsx", "r") as f:
    code = f.read()

effect = """  // Auto-buscar cuando cambia el filtro si ya hay una query
  useEffect(() => {
    if (query.trim().length > 0) {
      handleSearch(new Event('submit') as any);
    }
  }, [filter]);"""

code = code.replace(effect, "")

# Insert it after handleSearch or state declarations
insert_pos = code.find("const handleSearch = async (e: React.FormEvent) => {")
code = code[:insert_pos] + effect + "\n\n  " + code[insert_pos:]

with open("src/components/SearchUI.tsx", "w") as f:
    f.write(code)
