import re

with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

# Replace imports
code = code.replace(
    "import { Home, Tv, Film, Gamepad2, Music, BookOpen, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';",
    "import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';"
)

# Add album to links
old_links = """    { name: 'Música', href: '/music', icon: Music },
    { name: 'Libros', href: '/books', icon: BookOpen },
  ];"""
new_links = """    { name: 'Música', href: '/music', icon: Music },
    { name: 'Álbumes', href: '/albums', icon: Disc },
    { name: 'Libros', href: '/books', icon: BookOpen },
  ];"""

code = code.replace(old_links, new_links)

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
