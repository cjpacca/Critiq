import re

with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

# Add Trophy icon
if "Trophy" not in code:
    code = code.replace("Search, ChevronLeft, ChevronRight", "Search, ChevronLeft, ChevronRight, Trophy")

# Add link to links array
old_links = "{ name: 'Buscar', href: '/search', icon: Search },"
new_links = "{ name: 'Buscar', href: '/search', icon: Search },\n    { name: 'Tops (Rankings)', href: '/tops', icon: Trophy },"
code = code.replace(old_links, new_links)

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
