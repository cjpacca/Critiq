import re

with open("src/app/user/[username]/page.tsx", "r") as f:
    code = f.read()

# Add imports for server session and social actions
imports_to_add = """import { getServerSession } from "next-auth/next";
import { checkFriendship } from "@/app/actions/social";
import { FriendButton } from "./FriendButton";
"""

code = code.replace(
    'import { PrismaClient } from "@prisma/client";',
    'import { PrismaClient } from "@prisma/client";\n' + imports_to_add
)

# Replace the hardcoded loggedUser logic
old_logic = """  // Para el Taste Match: necesitamos saber quién es el usuario logueado actualmente.
  // Como no hay auth real, asumimos que el primer usuario es el logged-in.
  const loggedUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  const isOwnProfile = loggedUser?.id === user.id;"""

new_logic = """  const session = await getServerSession();
  const loggedUserId = (session?.user as any)?.id;
  const isOwnProfile = loggedUserId === user.id;
  
  let isFriend = false;
  let loggedUsername = "";
  if (loggedUserId) {
    isFriend = await checkFriendship(loggedUserId, user.username as string);
    const u = await prisma.user.findUnique({ where: { id: loggedUserId } });
    loggedUsername = u?.username || "";
  }"""

code = code.replace(old_logic, new_logic)

# Replace the Taste Match link section to include the FriendButton
old_buttons = """        {!isOwnProfile && (
          <div className="absolute -bottom-4 right-10">
            <Link 
              href={`/compare/${loggedUser?.username}/${user.username}`}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 hover:-translate-y-1"
            >
              <Star size={20} fill="currentColor" />
              Taste Match (Comparar)
            </Link>
          </div>
        )}"""

new_buttons = """        {!isOwnProfile && session && (
          <div className="absolute -bottom-4 right-10 flex items-center gap-4">
            <FriendButton targetUsername={user.username!} initialIsFriend={isFriend} />
            <Link 
              href={`/compare/${loggedUsername}/${user.username}`}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-6 py-3 rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 hover:-translate-y-1"
            >
              <Star size={20} fill="currentColor" />
              Taste Match
            </Link>
          </div>
        )}"""

code = code.replace(old_buttons, new_buttons)

with open("src/app/user/[username]/page.tsx", "w") as f:
    f.write(code)
