import re

with open("src/components/Sidebar.tsx", "r") as f:
    code = f.read()

# Replace button with Link to profile
old_button = """      <div className="mt-auto">
        <button 
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
          title={isCollapsed ? 'Mi Perfil' : undefined}
        >
          <User size={16} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Mi Perfil</span>}
        </button>
      </div>"""

new_button = """      <div className="mt-auto">
        <Link 
          href="/user/CritiqAdmin"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium transition-all text-sm ${isCollapsed ? 'px-0' : ''}`}
          title={isCollapsed ? 'Mi Perfil' : undefined}
        >
          <User size={16} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Mi Perfil</span>}
        </Link>
      </div>"""

code = code.replace(old_button, new_button)

with open("src/components/Sidebar.tsx", "w") as f:
    f.write(code)
