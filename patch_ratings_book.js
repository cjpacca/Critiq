const fs = require('fs');
let code = fs.readFileSync('src/app/actions/ratings.ts', 'utf8');

code = code.replace(
  `export async function saveRating(type: 'movie' | 'tv' | 'track', mediaData: any, scores: Record<string, number>) {`,
  `export async function saveRating(type: 'movie' | 'tv' | 'track' | 'book', mediaData: any, scores: Record<string, number>) {`
);

const trackBlockEnd = `      }
    });
  }

  return { success: true };
}
`;

const bookLogic = `      }
    });

  } else if (type === 'book') {
    let releaseDateParsed: Date | null = null;
    try {
      if (mediaData.volumeInfo?.publishedDate) {
        releaseDateParsed = new Date(mediaData.volumeInfo.publishedDate.substring(0, 10));
      }
    } catch (e) {
      console.error("Error parsing book date", e);
    }

    const vol = mediaData.volumeInfo || {};
    const book = await prisma.book.upsert({
      where: { googleId: String(mediaData.id) },
      update: {},
      create: {
        googleId: String(mediaData.id),
        title: vol.title || "Unknown Book",
        author: vol.authors?.[0] || "Unknown Author",
        posterUrl: vol.imageLinks?.thumbnail?.replace("http:", "https:") || "",
        releaseDate: releaseDateParsed,
        raw_metadata: mediaData
      }
    });

    await prisma.bookRating.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {
        adiccion: scores.adiccion || 0,
        conexionPersonajes: scores.conexionPersonajes || 0,
        fluidezLectura: scores.fluidezLectura || 0,
        historia: scores.historia || 0,
        mundo: scores.mundo || 0,
        ritmo: scores.ritmo || 0,
        impacto: scores.impacto || 0,
        final: scores.final || 0,
        totalScore: totalScore || 0
      },
      create: {
        userId: user.id,
        bookId: book.id,
        adiccion: scores.adiccion || 0,
        conexionPersonajes: scores.conexionPersonajes || 0,
        fluidezLectura: scores.fluidezLectura || 0,
        historia: scores.historia || 0,
        mundo: scores.mundo || 0,
        ritmo: scores.ritmo || 0,
        impacto: scores.impacto || 0,
        final: scores.final || 0,
        totalScore: totalScore || 0
      }
    });
  }

  return { success: true };
}
`;

code = code.replace(trackBlockEnd, bookLogic);

fs.writeFileSync('src/app/actions/ratings.ts', code);
