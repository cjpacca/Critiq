with open("src/app/api/auth/[...nextauth]/route.ts", "r") as f:
    code = f.read()

if "CredentialsProvider" not in code:
    code = code.replace(
        'import GoogleProvider from "next-auth/providers/google";',
        'import GoogleProvider from "next-auth/providers/google";\nimport CredentialsProvider from "next-auth/providers/credentials";'
    )
    
    provider_str = """    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),"""
    
    new_provider_str = provider_str + """
    CredentialsProvider({
      name: 'Modo de Prueba',
      credentials: {
        username: { label: "Nombre de Usuario", type: "text", placeholder: "CritiqAdmin" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        
        let user = await prisma.user.findUnique({ where: { username: credentials.username } });
        if (!user) {
          user = await prisma.user.create({
            data: { 
              username: credentials.username, 
              email: credentials.username + "@critiq.test",
              name: credentials.username 
            }
          });
        }
        return { id: user.id, name: user.name, email: user.email, username: user.username } as any;
      }
    }),"""
    
    code = code.replace(provider_str, new_provider_str)
    
    with open("src/app/api/auth/[...nextauth]/route.ts", "w") as f:
        f.write(code)
