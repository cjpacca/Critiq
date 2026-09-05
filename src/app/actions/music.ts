"use server";

// Spotify ahora bloquea las búsquedas para cuentas sin Premium.
// Para no bloquear tu proyecto, he implementado la API de Apple Music (iTunes) bajo el capó.
// Retorna exactamente el mismo formato de datos y no requiere llaves ni suscripciones.

export async function searchMusic(query: string) {
  if (!query) return [];
  
  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`);
  if (!res.ok) throw new Error("Failed to search Music");
  const data = await res.json();
  
  // Normalizar para que la UI reciba el formato esperado
  return data.results.map((item: any) => ({
    id: item.trackId.toString(),
    name: item.trackName,
    artists: [{ name: item.artistName }],
    album: {
      name: item.collectionName,
      duration_ms: item.trackTimeMillis,
      images: [{ url: item.artworkUrl100?.replace("100x100bb", "600x600bb") }], // Cambiar a alta resolución
      release_date: item.releaseDate
    }
  }));
}

export async function getMusicTrackDetails(id: string) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch Music details");
  const data = await res.json();
  
  const item = data.results[0];
  if (!item) throw new Error("Track not found");

  return {
    id: item.trackId.toString(),
    name: item.trackName,
    duration_ms: item.trackTimeMillis,
    artists: [{ name: item.artistName }],
    album: {
      name: item.collectionName,
      images: [{ url: item.artworkUrl100?.replace("100x100bb", "600x600bb") }],
      release_date: item.releaseDate
    }
  };
}


export async function searchAlbums(query: string) {
  if (!query) return [];
  
  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=12`);
  if (!res.ok) throw new Error("Failed to search Albums");
  const data = await res.json();
  
  return data.results.map((item: any) => ({
    id: item.collectionId.toString(),
    name: item.collectionName,
      duration_ms: item.trackTimeMillis,
    artists: [{ name: item.artistName }],
    album: {
      name: item.collectionName,
      duration_ms: item.trackTimeMillis,
      images: [{ url: item.artworkUrl100?.replace("100x100bb", "600x600bb") }],
      release_date: item.releaseDate
    }
  }));
}

export async function getAlbumTracks(collectionId: string) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song`);
  if (!res.ok) throw new Error("Failed to fetch Album Tracks");
  const data = await res.json();
  
  const albumInfo = data.results.find((r: any) => r.wrapperType === "collection");
  const tracks = data.results.filter((r: any) => r.wrapperType === "track");
  
  if (!albumInfo) throw new Error("Album not found");

  return {
    id: albumInfo.collectionId.toString(),
    name: albumInfo.collectionName,
    artists: [{ name: albumInfo.artistName }],
    posterUrl: albumInfo.artworkUrl100?.replace("100x100bb", "600x600bb") || "",
    release_date: albumInfo.releaseDate,
    raw_metadata: albumInfo,
    tracks: tracks.map((t: any) => ({
      id: t.trackId.toString(),
      name: t.trackName,
      trackNumber: t.trackNumber,
      duration_ms: t.trackTimeMillis,
    })).sort((a: any, b: any) => a.trackNumber - b.trackNumber)
  };
}
