with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

if "credentials" not in code:
    google_btn = """          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.11 0 9.6-3.4 9.6-9.9c0-.83-.11-1.46-.11-1.46z"/></svg>
            Continuar con Google
          </button>"""
          
    test_btn = google_btn + """
          <div className="pt-4 border-t border-white/10 mt-4">
            <button 
              onClick={() => signIn('credentials', { username: 'CritiqAdmin', callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transition-all hover:scale-[1.02]"
            >
              Entrar en Modo Prueba (Auto-Login)
            </button>
          </div>"""
          
    code = code.replace(google_btn, test_btn)
    
    with open("src/app/login/page.tsx", "w") as f:
        f.write(code)
