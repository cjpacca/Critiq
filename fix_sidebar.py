with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

if "next-auth/react" not in code:
    code = "import { useSession, signOut } from 'next-auth/react';\n" + code

if "LogOut" not in code or "import { Home" not in code.split("LogOut")[0]:
    code = code.replace(
        "import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';",
        "import { Home, Tv, Film, Gamepad2, Music, BookOpen, Disc, User, Search, ChevronLeft, ChevronRight, LogIn, LogOut } from 'lucide-react';"
    )

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
