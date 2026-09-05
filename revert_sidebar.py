import re

with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

# Remove useSession import and LogIn/LogOut
code = code.replace("import { useSession, signOut } from 'next-auth/react';\n", "")
code = code.replace("LogIn, LogOut", "")

# Remove session hook
code = code.replace("const { data: session } = useSession();\n  ", "")

# Replace the login/profile block with the hardcoded link
old_profile_block = """      <div className="mt-auto space-y-2">
        {session ? (
          <>
            <Link 
              href={`/user/${(session.user as any)?.username || ''}`}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
              title={isCollapsed ? 'Mi Perfil' : undefined}
            >
              <User size={16} className="shrink-0 text-blue-400" />
              {!isCollapsed && <span className="whitespace-nowrap truncate max-w-[120px]">{(session.user as any)?.username || 'Mi Perfil'}</span>}
            </Link>
            <button 
              onClick={() => signOut()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
              title={isCollapsed ? 'Cerrar Sesión' : undefined}
            >
              <LogOut size={16} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Salir</span>}
            </button>
          </>
        ) : (
          <Link 
            href="/login"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black transition-all text-sm shadow-lg shadow-blue-500/20 ${isCollapsed ? 'px-0' : ''}`}
            title={isCollapsed ? 'Iniciar Sesión' : undefined}
          >
            <LogIn size={16} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Iniciar Sesión</span>}
          </Link>
        )}
      </div>"""

new_profile_block = """      <div className="mt-auto">
        <Link 
          href="/user/CritiqAdmin"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
          title={isCollapsed ? 'Mi Perfil' : undefined}
        >
          <User size={16} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Mi Perfil</span>}
        </Link>
      </div>"""

code = code.replace(old_profile_block, new_profile_block)

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
