with open("src/app/api/auth/[...nextauth]/route.ts", "r") as f:
    code = f.read()

old_callbacks = """  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        // Adjuntar el ID de la base de datos y el username a la sesión
        (session.user as any).id = user.id;
        (session.user as any).username = (user as any).username || user.name?.replace(/\s+/g, '').toLowerCase() || "User" + Math.floor(Math.random()*1000);
        
        // Si el usuario recién creado no tiene username, se lo actualizamos
        if (!(user as any).username) {
          await prisma.user.update({
            where: { id: user.id },
            data: { username: (session.user as any).username }
          });
        }
      }
      return session;
    },
  },"""

new_callbacks = """  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || user.name?.replace(/\s+/g, '').toLowerCase() || "User" + Math.floor(Math.random()*1000);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        
        // Asegurar que el usuario existe (opcional, pero NextAuth ya lo hace)
      }
      return session;
    },
  },"""

code = code.replace(old_callbacks, new_callbacks)

with open("src/app/api/auth/[...nextauth]/route.ts", "w") as f:
    f.write(code)
