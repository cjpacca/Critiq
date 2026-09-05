const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

code = code.replace(
  `const bookCount = await prisma.bookRating.count();`,
  `const bookCount = await prisma.bookRating.count();\n  const gameCount = await prisma.gameRating.count();`
);

code = code.replace(
  `const topBooks = await prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { book: true } });`,
  `const topBooks = await prisma.bookRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { book: true } });\n  const topGames = await prisma.gameRating.findMany({ orderBy: { totalScore: 'desc' }, take: 3, include: { game: true } });`
);

code = code.replace(
  `{ label: "Videojuegos", value: "0", icon: Gamepad2, colors: mediaColors.games },`,
  `{ label: "Videojuegos", value: gameCount, icon: Gamepad2, colors: mediaColors.games },`
);

code = code.replace(
  `className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8"`,
  `className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-8"`
);

const gameCol = `
        <RankingColumn 
          title="Top Juegos" 
          icon={Gamepad2} 
          color={mediaColors.games} 
          imageClass="w-16 h-24 rounded-md aspect-[3/4]"
          items={topGames.map(g => ({
            id: g.id,
            title: g.game.title,
            poster: g.game.posterUrl || "",
            score: g.totalScore
          }))}
        />
`;

code = code.replace(`</section>\n\n    </div>`, gameCol + `      </section>\n\n    </div>`);

fs.writeFileSync('src/app/page.tsx', code);
