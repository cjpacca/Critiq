with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

# Replace Lucide imports
import_line = "import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';"
new_import_line = "import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight, LogIn, LogOut } from 'lucide-react';"

code = code.replace(import_line, new_import_line)

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
