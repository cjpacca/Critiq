import re

with open("src/app/user/[username]/page.tsx", "r") as f:
    code = f.read()

# Remove next-auth import
code = code.replace('import { getServerSession } from "next-auth/next";\n', "")

# Revert logic
old_logic = """  const session = await getServerSession();
  const loggedUserId = (session?.user as any)?.id;
  const isOwnProfile = loggedUserId === user.id;
  
  let isFriend = false;
  let loggedUsername = "";
  if (loggedUserId) {
    isFriend = await checkFriendship(loggedUserId, user.username as string);
    const u = await prisma.user.findUnique({ where: { id: loggedUserId } });
    loggedUsername = u?.username || "";
  }"""

new_logic = """  const loggedUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  const loggedUserId = loggedUser?.id;
  const isOwnProfile = loggedUserId === user.id;
  
  let isFriend = false;
  let loggedUsername = loggedUser?.username || "";
  if (loggedUserId) {
    isFriend = await checkFriendship(loggedUserId, user.username as string);
  }"""

code = code.replace(old_logic, new_logic)

# Replace buttons block 
old_buttons = """        {!isOwnProfile && session && (
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

new_buttons = """        {!isOwnProfile && loggedUserId && (
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
